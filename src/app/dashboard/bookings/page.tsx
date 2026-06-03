import { SafeFoundationPage } from "@/components/dashboard/safe-foundation-page";

export default function BookingsPage() {
  return (
    <SafeFoundationPage
      eyebrow="Booking foundation"
      title="Bookings"
      description="Viva Med maps booking operations to appointment requests and clinic agenda workflows. Live Cal.com writes remain disabled."
      items={[
        { label: "Public booking", status: "ready", detail: "The public booking page can collect requests and create safe local workflow records." },
        { label: "Clinic agenda", status: "ready", detail: "Appointments are linked to patient records and visible in the dashboard/calendar." },
        { label: "Cal.com sync", status: "blocked", detail: "No live event type, calendar write, or provider booking is created." },
        { label: "Medical metadata", status: "doctor_review", detail: "Sensitive appointment reasons require approved provider posture before external sync." },
      ]}
      links={[
        { href: "/book", label: "Public booking", detail: "Open the patient booking request flow." },
        { href: "/dashboard/appointments", label: "Appointments", detail: "Manage internal appointment records." },
        { href: "/dashboard/calendar", label: "Calendar", detail: "Review the clinic agenda view." },
      ]}
    />
  );
}
