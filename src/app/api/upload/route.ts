import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const BUCKET = "supplier-media";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Verify user is a supplier
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) ?? "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP files are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 8 MB" },
        { status: 400 }
      );
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${supplier.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const admin = await createAdminClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[POST /api/upload] storage upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: publicUrl } = admin.storage.from(BUCKET).getPublicUrl(fileName);

    // Get sort order for new photo
    const { count } = await supabase
      .from("supplier_media")
      .select("id", { count: "exact", head: true })
      .eq("supplier_id", supplier.id);

    const { data: media, error: insertError } = await supabase
      .from("supplier_media")
      .insert({
        supplier_id: supplier.id,
        type: "photo",
        url: publicUrl.publicUrl,
        caption: caption || null,
        sort_order: (count ?? 0) + 1,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[POST /api/upload] insert error:", insertError);
      // Try to clean up the storage file
      await admin.storage.from(BUCKET).remove([fileName]);
      return NextResponse.json({ error: "Failed to save photo record" }, { status: 500 });
    }

    return NextResponse.json({ media }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
