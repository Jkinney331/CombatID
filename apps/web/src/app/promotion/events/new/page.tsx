"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    type: "MMA",
    description: "",
    commission: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would submit to API
    router.push("/promotion/events/1");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/events" className="text-[#6b7280] hover:text-[#111827]">
          Events
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827] font-medium">New Event</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Create New Event</h1>
        <p className="text-[#6b7280]">Set up a new fight event</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#374151] mb-1">Event Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., EFL Fight Night 48"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Start Time *</label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Venue *</label>
            <input
              type="text"
              required
              placeholder="e.g., MGM Grand Garden Arena"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Location *</label>
            <input
              type="text"
              required
              placeholder="e.g., Las Vegas, NV"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Event Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
            >
              <option value="MMA">MMA</option>
              <option value="Boxing">Boxing</option>
              <option value="Kickboxing">Kickboxing</option>
              <option value="Muay Thai">Muay Thai</option>
              <option value="BJJ">BJJ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Sanctioning Commission *</label>
            <select
              required
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
            >
              <option value="">Select commission...</option>
              <option value="nac">Nevada Athletic Commission</option>
              <option value="csac">California State Athletic Commission</option>
              <option value="nysac">New York State Athletic Commission</option>
              <option value="abc">Association of Boxing Commissions</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
            <textarea
              placeholder="Event description..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex justify-end gap-3">
          <Link
            href="/promotion/events"
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
          >
            Create Event
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-xl p-4">
        <h3 className="font-medium text-[#7C3AED] mb-2">What happens next?</h3>
        <ul className="text-sm text-[#6b7280] space-y-1">
          <li>1. Create your event with basic information</li>
          <li>2. Build your fight card by adding bouts</li>
          <li>3. Send bout agreements to fighters for signature</li>
          <li>4. Submit to the commission for approval once all contracts are signed</li>
          <li>5. Commission reviews fighter eligibility and approves the event</li>
        </ul>
      </div>
    </div>
  );
}
