import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import CustomerPortalActions from "@/components/admin/CustomerPortalActions";

type Shipment = {
  id: number;
  tracking_number: string;

  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  pickup_address: string;
  origin: string;

  recipient_name: string;
  recipient_phone: string;
  recipient_email: string | null;
  delivery_address: string;
  destination: string;

  parcel_type: string;
  service: string;
  weight: number | null;
  parcel_value: number | null;

  payment_status: string;
  current_status: string;
  current_location: string;

  estimated_delivery: string | null;
  delivered_at: string | null;
  received_by: string | null;
delivery_notes: string | null;
delivery_proof_path: string | null;
  notes: string | null;
  created_at: string;
  customer_portal_token: string;
};

type TrackingEvent = {
  id: number;
  shipment_id: number;
  status: string;
  location: string;
  description: string | null;
  event_time: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getShipment(id: string): Promise<Shipment | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Could not load shipment:", error);
    return null;
  }

  return data;
}

async function getTrackingEvents(
  shipmentId: string
): Promise<TrackingEvent[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tracking_events")
    .select(
      "id, shipment_id, status, location, description, event_time"
    )
    .eq("shipment_id", shipmentId)
    .order("event_time", { ascending: false });

  if (error) {
    console.error("Could not load tracking history:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return [];
  }

  return data ?? [];

}

  async function getDeliveryProofUrl(
  path: string | null
): Promise<string | null> {
  if (!path) {
    return null;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage
    .from("delivery-proofs")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error(
      "Could not create delivery proof URL:",
      error
    );
    return null;
  }

  return data.signedUrl;
}

/* ======================================================
   UPDATE SHIPMENT DETAILS
====================================================== */

async function updateShipmentDetails(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const senderName = String(
    formData.get("senderName") || ""
  ).trim();

  const senderPhone = String(
    formData.get("senderPhone") || ""
  ).trim();

  const senderEmail = String(
    formData.get("senderEmail") || ""
  ).trim();

  const pickupAddress = String(
    formData.get("pickupAddress") || ""
  ).trim();

  const origin = String(
    formData.get("origin") || ""
  ).trim();

  const recipientName = String(
    formData.get("recipientName") || ""
  ).trim();

  const recipientPhone = String(
    formData.get("recipientPhone") || ""
  ).trim();

  const recipientEmail = String(
    formData.get("recipientEmail") || ""
  ).trim();

  const deliveryAddress = String(
    formData.get("deliveryAddress") || ""
  ).trim();

  const destination = String(
    formData.get("destination") || ""
  ).trim();

  const parcelType = String(
    formData.get("parcelType") || ""
  );

  const service = String(
    formData.get("service") || ""
  );

  const weightValue = String(
    formData.get("weight") || ""
  );

  const parcelValueInput = String(
    formData.get("parcelValue") || ""
  );

  const estimatedDelivery = String(
    formData.get("estimatedDelivery") || ""
  );



  const notes = String(
    formData.get("notes") || ""
  ).trim();

  const weight =
    weightValue !== ""
      ? Number(weightValue)
      : null;

  const parcelValue =
    parcelValueInput !== ""
      ? Number(parcelValueInput)
      : null;

  if (
    !id ||
    !senderName ||
    !senderPhone ||
    !origin ||
    !pickupAddress ||
    !recipientName ||
    !recipientPhone ||
    !destination ||
    !deliveryAddress ||
    !parcelType ||
    !service
  ) {
    return;
  }

  if (
    weight !== null &&
    (Number.isNaN(weight) || weight <= 0)
  ) {
    return;
  }

  if (
    parcelValue !== null &&
    (Number.isNaN(parcelValue) || parcelValue < 0)
  ) {
    return;
  }

  const supabase = getSupabaseAdmin();
  

  const { error } = await supabase
    .from("shipments")
    
    .update({
      sender_name: senderName,
      sender_phone: senderPhone,
      sender_email:
        senderEmail !== "" ? senderEmail : null,

      pickup_address: pickupAddress,
      origin,

      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_email:
        recipientEmail !== ""
          ? recipientEmail
          : null,

      delivery_address: deliveryAddress,
      destination,

      parcel_type: parcelType,
      service,
      weight,
      parcel_value: parcelValue,

      estimated_delivery:
        estimatedDelivery !== ""
          ? estimatedDelivery
          : null,

      

      notes:
        notes !== ""
          ? notes
          : null,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Could not update shipment details:",
      error
    );

    return;
  }

  revalidatePath(`/admin/shipments/${id}`);
  revalidatePath("/admin/shipments");
  revalidatePath("/admin");
  revalidatePath("/track");

  redirect(`/admin/shipments/${id}`);
}

/* ======================================================
   UPDATE TRACKING STATUS
====================================================== */

async function updateShipmentStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  const status = String(
    formData.get("status") || ""
  );

  const currentLocation = String(
    formData.get("currentLocation") || ""
  ).trim();
  
  const receivedBy = String(
  formData.get("receivedBy") || ""
).trim();

const deliveryNotes = String(
  formData.get("deliveryNotes") || ""
).trim();

const deliveryPhoto = formData.get("deliveryPhoto");

const shipmentDeliveryProofPath = String(
  formData.get("existingDeliveryProofPath") || ""
).trim() || null;

  const previousStatus = String(
    formData.get("previousStatus") || ""
  );

  const previousLocation = String(
    formData.get("previousLocation") || ""
  );

  const allowedStatuses = [
    "Pending",
    "Collected",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ];

  if (
    !id ||
    !allowedStatuses.includes(status) ||
    !currentLocation
  ) {
    return;
  }

  const supabase = getSupabaseAdmin();

// Load the real current shipment status from the database.
// Do not rely only on the hidden previousStatus form field.
const {
  data: existingShipment,
  error: existingShipmentError,
} = await supabase
  .from("shipments")
  .select("current_status")
  .eq("id", id)
  .single();

if (existingShipmentError || !existingShipment) {
  console.error(
    "Could not verify current shipment status:",
    existingShipmentError
  );
  return;
}

// Delivered is a terminal status.
// Once delivered, the shipment cannot be moved backward.
if (
  existingShipment.current_status === "Delivered" &&
  status !== "Delivered"
) {
  console.error(
    "Delivered shipment cannot be moved back to another status."
  );

  redirect(`/admin/shipments/${id}`);
}

const currentStatusIndex = allowedStatuses.indexOf(
  existingShipment.current_status
);

const newStatusIndex = allowedStatuses.indexOf(status);

if (
  currentStatusIndex !== -1 &&
  newStatusIndex !== -1 &&
  newStatusIndex !== currentStatusIndex &&
  newStatusIndex !== currentStatusIndex + 1
) {
  console.error(
    `Invalid shipment status change: ${existingShipment.current_status} → ${status}`
  );

  redirect(`/admin/shipments/${id}`);
}

// Require delivery confirmation details before marking as Delivered
if (status === "Delivered") {
  if (!receivedBy) {
    console.error(
      "Received by is required before marking a shipment as Delivered."
    );

    redirect(`/admin/shipments/${id}`);
  }

  const hasExistingProof =
    Boolean(shipmentDeliveryProofPath);

  const hasNewProof =
    deliveryPhoto instanceof File &&
    deliveryPhoto.size > 0;

  if (!hasExistingProof && !hasNewProof) {
    console.error(
      "Delivery proof photo is required before marking a shipment as Delivered."
    );

    redirect(`/admin/shipments/${id}`);
  }
}

let deliveryProofPath: string | null =
  shipmentDeliveryProofPath;

if (
  status === "Delivered" &&
  deliveryPhoto instanceof File &&
  deliveryPhoto.size > 0
) {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(deliveryPhoto.type)) {
    console.error("Unsupported delivery proof file type.");
    return;
  }

  if (deliveryPhoto.size > 5 * 1024 * 1024) {
    console.error("Delivery proof image is too large.");
    return;
  }

  const extension =
    deliveryPhoto.name.split(".").pop() || "jpg";

  const filePath =
    `${id}/${Date.now()}-delivery-proof.${extension}`;

  const arrayBuffer =
    await deliveryPhoto.arrayBuffer();

  const { error: uploadError } =
    await supabase.storage
      .from("delivery-proofs")
      .upload(
        filePath,
        arrayBuffer,
        {
          contentType: deliveryPhoto.type,
          upsert: false,
        }
      );

  if (uploadError) {
    console.error(
      "Could not upload delivery proof:",
      uploadError
    );

    return;
  }

  deliveryProofPath = filePath;
if (
  shipmentDeliveryProofPath &&
  shipmentDeliveryProofPath !== filePath
) {
  const { error: removeOldProofError } = await supabase.storage
    .from("delivery-proofs")
    .remove([shipmentDeliveryProofPath]);

  if (removeOldProofError) {
    console.error(
      "Could not remove old delivery proof:",
      removeOldProofError
    );
  }
}
}

  const { error: shipmentError } = await supabase
  .from("shipments")
  
  .update({
    current_status: status,
    current_location: currentLocation,

    delivered_at:
      status === "Delivered"
        ? new Date().toISOString()
        : null,

    received_by:
      status === "Delivered" && receivedBy
        ? receivedBy
        : null,

    delivery_notes:
      status === "Delivered" && deliveryNotes
        ? deliveryNotes
        : null,
delivery_proof_path:
  status === "Delivered"
    ? deliveryProofPath
    : null,

  })
  .eq("id", id);

  if (shipmentError) {
    console.error(
      "Could not update shipment:",
      shipmentError
    );

    return;
  }

  const hasTrackingChanged =
    status !== previousStatus ||
    currentLocation !== previousLocation;

  if (hasTrackingChanged) {
    const { error: eventError } = await supabase
      .from("tracking_events")
      .insert({
        shipment_id: Number(id),
        status,
        location: currentLocation,
        description: `Shipment status updated to ${status}`,
        event_time: new Date().toISOString(),
      });

    if (eventError) {
      console.error(
        "Could not save tracking event:",
        eventError
      );

      return;
    }
  }

  revalidatePath(`/admin/shipments/${id}`);
  revalidatePath("/admin/shipments");
  revalidatePath("/admin");
  revalidatePath("/track");

  redirect(`/admin/shipments/${id}`);
}

const serviceLocations = [
  { code: "GBE", name: "Gaborone" },
  { code: "LOB", name: "Lobatse" },
  { code: "RAM", name: "Ramotswa" },
  { code: "MOL", name: "Molepolole" },
  { code: "KYE", name: "Kanye" },
  { code: "MOC", name: "Mochudi" },
  { code: "JWG", name: "Jwaneng" },
  { code: "OODI", name: "Oodi" },
  { code: "MAH", name: "Mahalapye" },
  { code: "DIBETE", name: "Dibete" },
  { code: "PALLAROAD", name: "Palla Road" },
  { code: "SHOSHONG", name: "Shoshong" },
  { code: "PLY", name: "Palapye" },
  { code: "SRW", name: "Serowe" },
  { code: "SER", name: "Serule" },
  { code: "SPK", name: "Selibe Phikwe" },
  { code: "BOB", name: "Bobonong" },
  { code: "MMD", name: "Mmadinare" },
  { code: "FRW", name: "Francistown" },
  { code: "TNT", name: "Tonota" },
  { code: "MATH", name: "Mathangwane" },
  { code: "MAS", name: "Masunga" },
  { code: "SEB", name: "Sebina" },
  { code: "TTM", name: "Tutume" },
  { code: "LTK", name: "Letlhakane" },
  { code: "NAT", name: "Nata" },
  { code: "MAU", name: "Maun" },
  { code: "KAS", name: "Kasane" },
  { code: "GWE", name: "Gweta" },
];
const shipmentStatuses = [
  "Pending",
  "Collected",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default async function ShipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const shipment = await getShipment(id);

  if (!shipment) {
    notFound();
  }

  const trackingEvents = await getTrackingEvents(id);

  const deliveryProofUrl = await getDeliveryProofUrl(
  shipment.delivery_proof_path
);

const todayBotswana = new Date().toLocaleDateString("en-CA", {
  timeZone: "Africa/Gaborone",
});

const currentStatusIndex = shipmentStatuses.indexOf(
  shipment.current_status
);

const availableStatuses =
  currentStatusIndex >= 0
    ? shipmentStatuses.slice(
        currentStatusIndex,
        currentStatusIndex + 2
      )
    : [shipment.current_status];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-10">
          <a
            href="/admin/shipments"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            ← Back to All Shipments
          </a>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-500">
            Shipment Management
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {shipment.tracking_number}
          </h1>

          <p className="mt-3 text-slate-600">
            Manage shipment information, status and
            tracking updates.
          </p>
          
<div className="mt-6 flex flex-wrap gap-3">
  <a
    href={`/customer/${shipment.customer_portal_token}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-black text-white transition hover:bg-orange-600"
  >
    View Customer Portal
  </a>

  <CustomerPortalActions
    token={shipment.customer_portal_token}
    customerName={shipment.sender_name}
    customerPhone={shipment.sender_phone}
    trackingNumber={shipment.tracking_number}
  />
</div>
</div>
        {/* CURRENT STATUS */}

        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                Current Status
              </p>

              <p className="mt-3 text-3xl font-black">
                {shipment.current_status}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-400">
                Current Location
              </p>

              <p className="mt-2 text-xl font-black">
                {shipment.current_location}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-400">
                Estimated Delivery
              </p>

              <p className="mt-2 text-xl font-black">
                {shipment.estimated_delivery ||
                  "Not provided"}
              </p>
            </div>

          </div>
        </section>

        {shipment.current_status === "Delivered" && (
  <section className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8">
    <p className="text-sm font-bold uppercase tracking-widest text-green-700">
      Delivery Completed
    </p>

    <h2 className="mt-3 text-3xl font-black text-green-950">
      Parcel delivered successfully
    </h2>

    <p className="mt-3 text-green-800">
      This shipment has reached its destination and is marked as completed.
    </p>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

<div className="rounded-2xl bg-white p-5">
  <p className="text-sm font-bold text-green-700">
    Received by
  </p>

  <p className="mt-2 font-black text-green-950">
    {shipment.received_by || "Not recorded"}
  </p>
</div>

<div className="rounded-2xl bg-white p-5">
  <p className="text-sm font-bold text-green-700">
    Delivery notes
  </p>

  <p className="mt-2 text-sm font-semibold leading-6 text-green-950">
    {shipment.delivery_notes || "No delivery notes"}
  </p>
</div>


      <div className="rounded-2xl bg-white p-5">
  <p className="text-sm font-bold text-green-700">
    Delivered on
  </p>



  <p className="mt-2 font-black text-green-950">
    {shipment.delivered_at
      ? new Date(shipment.delivered_at).toLocaleString()
      : "Not recorded"}
  </p>
</div>

      <div className="rounded-2xl bg-white p-5">
        <p className="text-sm font-bold text-green-700">
          Final location
        </p>

        <p className="mt-2 font-black text-green-950">
          {shipment.current_location}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5">
        <p className="text-sm font-bold text-green-700">
          Tracking number
        </p>

        <p className="mt-2 font-black text-green-950">
          {shipment.tracking_number}
        </p>
      </div>
    </div>

          

      {deliveryProofUrl && (
        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">
            Proof of Delivery
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-green-200 bg-white p-3">
            <img
              src={deliveryProofUrl}
              alt="Delivery proof"
              className="max-h-[500px] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

    

  </section>
)}

        {/* ======================================================
            TRACKING UPDATE
        ====================================================== */}

        <section className="mt-8 rounded-3xl bg-blue-700 p-8 text-white shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
            Tracking Update
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Update parcel location and status
          </h2>

          <form
            action={updateShipmentStatus}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="id"
              value={shipment.id}
            />

            <input
              type="hidden"
              name="previousStatus"
              value={shipment.current_status}
            />

            <input
              type="hidden"
              name="previousLocation"
              value={shipment.current_location}
            />

            <div>
              <label
                htmlFor="currentLocation"
                className="mb-2 block text-sm font-bold text-blue-100"
              >
                Current location
              </label>

              <select
  id="currentLocation"
  name="currentLocation"
  required
  defaultValue={shipment.current_location}
  className="w-full rounded-xl border border-white/20 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
>
  <option value="" disabled>
    Select current location
  </option>

  {serviceLocations.map((location) => (
    <option
      key={location.code}
      value={location.name}
    >
      {location.code} — {location.name}
    </option>
  ))}
</select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-bold text-blue-100"
              >
                Shipment status
              </label>

              <select
  id="status"
  name="status"
  defaultValue={shipment.current_status}
  className="w-full rounded-xl border border-white/20 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
>
  {availableStatuses.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
            </div>

            {(
  shipment.current_status === "Out for Delivery" ||
  shipment.current_status === "Delivered"
) && (
  <>
    <div className="md:col-span-2 rounded-2xl border border-white/20 bg-white/10 p-5">
  <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
    Completing Delivery
  </p>

  <p className="mt-2 text-sm leading-6 text-blue-100">
    To mark this shipment as Delivered, enter the person who received the
    parcel and upload a delivery proof photo.
  </p>
</div>

    <div className="md:col-span-2">
      <label
        htmlFor="receivedBy"
        className="mb-2 block text-sm font-bold text-blue-100"
      >
        Received by <span className="text-orange-300">*</span>
      </label>

      <input
        id="receivedBy"
        name="receivedBy"
        type="text"
        defaultValue={shipment.received_by || ""}
        placeholder="Example: John Smith"
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
      />
    </div>

    <div className="md:col-span-2">
      <label
        htmlFor="deliveryNotes"
        className="mb-2 block text-sm font-bold text-blue-100"
      >
        Delivery notes{" "}
<span className="font-normal text-blue-200">
  (optional)
</span>
      </label>

      <textarea
        id="deliveryNotes"
        name="deliveryNotes"
        rows={3}
        defaultValue={shipment.delivery_notes || ""}
        placeholder="Example: Parcel received in good condition"
        className="w-full resize-none rounded-xl border border-white/20 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
      />
    </div>

    <input
      type="hidden"
      name="existingDeliveryProofPath"
      value={shipment.delivery_proof_path || ""}
    />

    <div className="md:col-span-2">
      {shipment.delivery_proof_path
  ? "Replace delivery proof photo"
  : "Delivery proof photo"}{" "}
<span className="text-orange-300">*</span>

      <input
        id="deliveryPhoto"
        name="deliveryPhoto"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-4 font-semibold text-slate-900"
      />

      <p className="mt-2 text-sm text-blue-100">
        JPG, PNG or WebP. Maximum 5 MB.
      </p>
    </div>
  </>
)}

<div className="md:col-span-2">
  <button
    type="submit"
    className="rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600"
  >
    Save Tracking Update
  </button>
</div>
            
          </form>
        </section>

<section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
        Internal Tracking History
      </p>

      <h2 className="mt-2 text-3xl font-black">
        All shipment updates
      </h2>

      <p className="mt-3 text-slate-600">
        Staff history showing every recorded status and location update.
      </p>
    </div>

    <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
      {trackingEvents.length} update
      {trackingEvents.length !== 1 ? "s" : ""}
    </div>
  </div>

  <div className="mt-8 space-y-4">
    {trackingEvents.map((event) => (
      <article
        key={event.id}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-lg font-black text-slate-900">
              {event.status}
            </p>

            <p className="mt-2 font-semibold text-slate-700">
              📍 {event.location}
            </p>

            {event.description && (
              <p className="mt-2 text-sm text-slate-600">
                {event.description}
              </p>
            )}
          </div>

          <time className="text-sm font-semibold text-slate-500">
            {new Date(event.event_time).toLocaleString()}
          </time>
        </div>
      </article>
    ))}

    {trackingEvents.length === 0 && (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No tracking history has been recorded yet.
      </div>
    )}
  </div>
</section>

        {/* ======================================================
            EDIT SHIPMENT
        ====================================================== */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Shipment Information
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Edit Shipment Details
          </h2>

          <p className="mt-3 text-slate-600">
            Correct customer, parcel or delivery
            information.
          </p>

          <form
            action={updateShipmentDetails}
            className="mt-10"
          >
            <input
              type="hidden"
              name="id"
              value={shipment.id}
            />

            {/* SENDER */}

            <div>
              <h3 className="text-xl font-black">
                Sender Information
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="senderName"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Sender name<span className="text-red-500">*</span>
                  </label>

                  <input
                    id="senderName"
                    name="senderName"
                    type="text"
                    required
                    defaultValue={shipment.sender_name}
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="senderPhone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Sender phone<span className="text-red-500">*</span>
                  </label>

                  <input
  id="senderPhone"
  name="senderPhone"
  type="tel"
  required
  inputMode="tel"
  pattern="(\+267)?[0-9]{8}"
  title="Enter an 8-digit Botswana number, optionally starting with +267"
  defaultValue={shipment.sender_phone}
  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
/>
                </div>

                <div>
                  <label
                    htmlFor="senderEmail"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Sender email{" "}
<span className="font-normal text-slate-400">
  (optional)
</span>
                  </label>

                  <input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    defaultValue={
                      shipment.sender_email || ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="origin"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Origin<span className="text-red-500">*</span>
                  </label>

                 <select
  id="origin"
  name="origin"
  required
  defaultValue={shipment.origin}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
>
  <option value="" disabled>
    Select origin town
  </option>

  {serviceLocations.map((location) => (
    <option
      key={location.code}
      value={location.name}
    >
      {location.code} — {location.name}
    </option>
  ))}
</select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="pickupAddress"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Pickup address<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="pickupAddress"
                    name="pickupAddress"
                    rows={3}
                    required
                    defaultValue={
                      shipment.pickup_address
                    }
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>
            </div>

            {/* RECIPIENT */}

            <div className="mt-10 border-t border-slate-200 pt-10">
              <h3 className="text-xl font-black">
                Recipient Information
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="recipientName"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Recipient name<span className="text-red-500">*</span>
                  </label>

                  <input
                    id="recipientName"
                    name="recipientName"
                    type="text"
                    required
                    defaultValue={
                      shipment.recipient_name
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="recipientPhone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Recipient phone<span className="text-red-500">*</span>
                  </label>

                  <input
  id="recipientPhone"
  name="recipientPhone"
  type="tel"
  required
  inputMode="tel"
  pattern="(\+267)?[0-9]{8}"
  title="Enter an 8-digit Botswana number, optionally starting with +267"
  defaultValue={shipment.recipient_phone}
  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
/>
                </div>

                <div>
                  <label
                    htmlFor="recipientEmail"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Recipient email{" "}
<span className="font-normal text-slate-400">
  (optional)
</span>
                  </label>

                  <input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    defaultValue={
                      shipment.recipient_email || ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destination"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Destination<span className="text-red-500">*</span>
                  </label>

                  <select
  id="destination"
  name="destination"
  required
  defaultValue={shipment.destination}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
>
  <option value="" disabled>
    Select destination town
  </option>

  {serviceLocations.map((location) => (
    <option
      key={location.code}
      value={location.name}
    >
      {location.code} — {location.name}
    </option>
  ))}
</select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="deliveryAddress"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Delivery address<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    rows={3}
                    required
                    defaultValue={
                      shipment.delivery_address
                    }
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>
            </div>

            {/* PARCEL */}

            <div className="mt-10 border-t border-slate-200 pt-10">
              <h3 className="text-xl font-black">
                Parcel Information
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label
                    htmlFor="parcelType"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Parcel type<span className="text-red-500">*</span>
                  </label>

                  <select
                    id="parcelType"
                    name="parcelType"
                    defaultValue={shipment.parcel_type}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4"
                  >
                    <option value="Document">
                      Document
                    </option>

                    <option value="Small Parcel">
                      Small Parcel
                    </option>

                    <option value="Large Parcel">
                      Large Parcel
                    </option>

                    <option value="Fragile Item">
                      Fragile Item
                    </option>

                    <option value="Business Goods">
                      Business Goods
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Service<span className="text-red-500">*</span>
                  </label>

                  <select
                    id="service"
                    name="service"
                    defaultValue={shipment.service}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4"
                  >
                    <option value="Same-Day Delivery">
                      Same-Day Delivery
                    </option>

                    <option value="Express Delivery">
                      Express Delivery
                    </option>

                    <option value="Standard Delivery">
                      Standard Delivery
                    </option>

                    <option value="International Shipping">
                      International Shipping
                    </option>

                    <option value="Freight Service">
                      Freight Service
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Weight (kg),<span className="text-red-500">*</span>
                  </label>

                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    defaultValue={
                      shipment.weight ?? ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parcelValue"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Parcel value (P){" "}
<span className="font-normal text-slate-400">
  (optional)
</span>
                  </label>

                  <input
                    id="parcelValue"
                    name="parcelValue"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      shipment.parcel_value ?? ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4"
                  />
                </div>

                <div>
                  <label
                    htmlFor="estimatedDelivery"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Estimated delivery<span className="text-red-500">*</span>
                  </label>

                  <input
                    id="estimatedDelivery"
                    name="estimatedDelivery"
                    type="date"
                     min={
    shipment.estimated_delivery &&
    shipment.estimated_delivery < todayBotswana
      ? shipment.estimated_delivery
      : todayBotswana
  }
                    defaultValue={
                      shipment.estimated_delivery || ""
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-4"
                  />
                </div>

                

                <div className="md:col-span-2 lg:col-span-3">
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Handling notes{" "}
<span className="font-normal text-slate-400">
  (optional)
</span>
                  </label>

                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={
                      shipment.notes || ""
                    }
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4"
                  />
                </div>

              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600"
              >
                Save Shipment Details
              </button>
            </div>

          </form>
        </section>
      </div>
    </main>
  );
}