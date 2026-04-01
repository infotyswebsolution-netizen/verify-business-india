import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const BUCKET = "supplier-media";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Get the media record and verify ownership via supplier
    const { data: media } = await supabase
      .from("supplier_media")
      .select("id, url, supplier_id, suppliers(user_id)")
      .eq("id", id)
      .single();

    if (!media) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ownerUserId = (media as any).suppliers?.user_id ?? (media as any).suppliers?.[0]?.user_id;
    if (ownerUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract storage path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/supplier-media/PATH
    const url = media.url;
    const bucketPrefix = `/storage/v1/object/public/${BUCKET}/`;
    const pathStart = url.indexOf(bucketPrefix);
    const storagePath = pathStart !== -1 ? url.slice(pathStart + bucketPrefix.length) : null;

    // Delete from storage
    if (storagePath) {
      const admin = await createAdminClient();
      await admin.storage.from(BUCKET).remove([storagePath]);
    }

    // Delete DB record
    const { error: deleteError } = await supabase
      .from("supplier_media")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[DELETE /api/upload/[id]]", deleteError);
      return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/upload/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
