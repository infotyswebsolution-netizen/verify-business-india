import { Metadata } from "next";
import { Settings } from "lucide-react";

export const metadata: Metadata = { title: "Settings — Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="bg-paper min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">Admin Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Platform configuration</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Settings size={28} className="text-gray-300" />
          </div>
          <h2 className="font-bold text-ink mb-2">Settings coming soon</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Platform-wide configuration options will be available here in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
