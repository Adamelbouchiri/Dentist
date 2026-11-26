# Backend API spec — new endpoints

The frontend in this repo is already built against everything below. Until an endpoint exists,
the UI falls back gracefully (a 404/405 from the API is treated as "not implemented yet").

- Base URL: `VITE_API_URL` + `/api` (e.g. `http://127.0.0.1:8000/api`)
- Auth: `Authorization: Bearer <sanctum token>` on every route marked 🔒. Admin routes 🛡 also require `role = admin`.
- Validation errors: standard Laravel `422 { message, errors: { field: [msg] } }` — the UI shows the first message.
- Paginated lists: standard Laravel paginator JSON (`data`, `current_page`, `last_page`, `total`, `per_page`).
- Dates `YYYY-MM-DD`, times `HH:mm` (24h, clinic local time — Africa/Casablanca).

---

## 1. Catalogue: services & doctors

Moves the hardcoded lists in `src/data/clinic.js` into the database.

### Migrations

```php
Schema::create('services', function (Blueprint $t) {
    $t->id();
    $t->string('slug')->unique();          // general, whitening, braces...
    $t->string('name');                    // "General Checkups" — still stored on appointments.service
    $t->text('description')->nullable();
    $t->unsignedInteger('price');          // whole dollars, as today
    $t->string('duration')->nullable();    // "45 min", "Same day"
    $t->string('icon')->nullable();        // stored file name (storage/images) or absolute URL
    $t->boolean('active')->default(true);
    $t->unsignedSmallInteger('sort')->default(0);
    $t->timestamps();
});

Schema::create('doctors', function (Blueprint $t) {
    $t->id();
    $t->string('name');
    $t->string('speciality');
    $t->decimal('rating', 2, 1)->default(5.0);
    $t->string('image')->nullable();
    $t->json('working_hours')->nullable(); // see below
    $t->json('days_off')->nullable();      // ["2026-12-25", ...]
    $t->boolean('active')->default(true);
    $t->timestamps();
});

Schema::table('appointments', function (Blueprint $t) {
    $t->foreignId('doctor_id')->nullable()->constrained()->nullOnDelete();
    $t->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
    $t->string('cancel_reason')->nullable();
    $t->string('payment_intent_id')->nullable()->index();
});
```

`working_hours` shape (keys `mon`..`sun`, missing/empty = closed):

```json
{ "mon": [["09:30","12:30"],["14:00","16:30"]], "tue": [...], "sat": [["09:30","12:30"]] }
```

Seed with the three current doctors and five services (names/prices from `src/data/clinic.js`).

### Public

| Method | Path | Response |
| --- | --- | --- |
| GET | `/services` | `[{ id, slug, name, description, price, duration, icon_url }]` (active only, ordered by `sort`) |
| GET | `/doctors` | `[{ id, name, speciality, rating, image_url, working_hours, days_off }]` (active only) |

`icon_url` / `image_url` = absolute URL (`asset('storage/images/'.$file)` or the stored URL).

### 🛡 Admin

| Method | Path | Body |
| --- | --- | --- |
| GET | `/admin/services` | — returns all (incl. inactive) |
| POST | `/admin/services` | multipart: `name, slug, description, price, duration, active, sort, icon (file, optional)` |
| POST | `/admin/services/{id}` | same, plus `_method=PUT` (multipart can't PUT) |
| DELETE | `/admin/services/{id}` | — |
| GET | `/admin/doctors` | — returns all |
| POST | `/admin/doctors` | multipart: `name, speciality, rating, active, image (file, optional), working_hours (JSON string), days_off (JSON string)` |
| POST | `/admin/doctors/{id}` | same, plus `_method=PUT` |
| DELETE | `/admin/doctors/{id}` | — |

---

## 2. Availability — prevent double booking

### Public

`GET /availability?doctor_id=1&date=2026-12-02`

```json
{
  "date": "2026-12-02",
  "doctor_id": 1,
  "closed": false,
  "slots": ["09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00"],
  "booked": ["10:00","14:30"]
}
```

- `slots`: 30-minute starts generated from the doctor's `working_hours` for that weekday (empty + `closed: true` on days off / closed days).
- `booked`: times with an appointment for that doctor & date whose status is not `cancelled`.

### Enforcement (important)

`POST /appointments`, `POST /appointments/checkout` and both reschedule endpoints must **re-check inside a DB transaction** and return `422 { errors: { time: ["This time slot has just been booked. Please choose another."] } }` if taken. Add a unique index to make it airtight:

```php
// partial uniqueness: ignore cancelled rows by nulling a helper column on cancel
$t->string('slot_key')->nullable()->unique(); // "{doctor_id}|{date}|{time}", set to null when cancelled
```

---

## 3. Booking & Stripe (webhook-driven)

Today the frontend creates the appointment *after* the browser confirms payment, so a closed tab = charged but no booking.

### 🔒 `POST /appointments/checkout`

Body: `{ service_id?, doctor_id?, service, doctor, price, date, time }`

1. Validate + check availability (see §2).
2. Create the appointment with `status = "pending"`, `payment_status = "pending"`.
3. Create a PaymentIntent for the **server-side** price of the service (never trust `price` from the client), `metadata.appointment_id = …`, store `payment_intent_id`.
4. Return `{ appointment, client_secret }`.

The frontend then calls `stripe.confirmCardPayment(client_secret)` and shows success.

### `POST /stripe/webhook` (no auth, verify signature with `STRIPE_WEBHOOK_SECRET`)

- `payment_intent.succeeded` → set `payment_status = "paid"`, `status = "upcoming"`, send confirmation email.
- `payment_intent.payment_failed` / `canceled` → set `status = "cancelled"`, free the slot.
- Schedule a job to cancel `pending` card appointments older than 30 minutes.

`POST /appointments` (pay in person) stays as-is, but should also check availability and set `doctor_id` / `service_id` when sent.

> Fallback in the UI: if `/appointments/checkout` returns 404 the old flow (`/create-payment-intent` then `POST /appointments`) is used.

---

## 4. Patient: cancel, reschedule, review

Include in every appointment JSON returned to patients: `doctor_id`, `service_id`, `review` (`null` or `{ id, rating, comment, approved }`), `cancel_reason`.

| Method | Path | Body | Rules |
| --- | --- | --- | --- |
| 🔒 PATCH | `/appointments/{id}/cancel` | `{ reason? }` | Owner only. Not allowed < 24h before or if completed/cancelled → 422. Sets `status=cancelled`; if paid, refund via Stripe and set `payment_status=refunded`. Returns appointment. |
| 🔒 PATCH | `/appointments/{id}/reschedule` | `{ date, time }` | Owner only, same 24h rule, availability check. Returns appointment. |
| 🔒 POST | `/appointments/{id}/review` | `{ rating (1–5), comment (≤1000) }` | Owner only, appointment must be `completed`, one per appointment. Creates review with `approved=false`. |

```php
Schema::create('reviews', function (Blueprint $t) {
    $t->id();
    $t->foreignId('user_id')->constrained()->cascadeOnDelete();
    $t->foreignId('appointment_id')->unique()->constrained()->cascadeOnDelete();
    $t->unsignedTinyInteger('rating');
    $t->text('comment');
    $t->boolean('approved')->default(false);
    $t->timestamps();
});
```

### Public — approved reviews for the homepage

`GET /reviews?limit=6` → `[{ id, rating, comment, service, created_at, user: { name, avatar } }]` (approved, newest first). Return only the first name + last initial in `user.name` for privacy (e.g. "Sarah M.").

### 🛡 Admin moderation

| Method | Path | Body |
| --- | --- | --- |
| GET | `/admin/reviews?status=pending\|approved&page=` | paginated, each with `user` + `appointment` |
| PATCH | `/admin/reviews/{id}` | `{ approved: bool }` |
| DELETE | `/admin/reviews/{id}` | — |

---

## 5. Contact form

```php
Schema::create('contact_messages', function (Blueprint $t) {
    $t->id();
    $t->string('name'); $t->string('email'); $t->string('phone')->nullable();
    $t->text('message');
    $t->timestamp('read_at')->nullable();
    $t->timestamps();
});
```

| Method | Path | Body / Response |
| --- | --- | --- |
| POST | `/contact` (public, throttle 5/min) | `{ name, email, phone?, message }` → `201 { message: "Thanks — we'll be in touch shortly." }`. Also email the clinic. |
| 🛡 GET | `/admin/contact-messages?status=unread\|all&page=` | paginated |
| 🛡 PATCH | `/admin/contact-messages/{id}` | `{ read: bool }` |
| 🛡 DELETE | `/admin/contact-messages/{id}` | — |

---

## 6. Notifications & reminders

### 🔒 Preferences

`GET /user/notification-preferences` → `{ email_reminders: true, whatsapp_reminders: false }`
`PUT /user/notification-preferences` with the same shape → returns it.

Store as two boolean columns on `users` (default `email_reminders = true`).

### What to send (backend only — no UI needed)

| Trigger | Channel |
| --- | --- |
| Appointment created / paid (webhook) | Mail `AppointmentConfirmed` |
| Admin changes status | Mail `AppointmentStatusChanged` |
| Cancelled / rescheduled | Mail |
| 24h before (`schedule->hourly()` command `appointments:remind`, flag `reminded_at`) | Mail if `email_reminders`; WhatsApp (Twilio / Meta Cloud API) if `whatsapp_reminders` and a phone is on file |

Use queued notifications (`ShouldQueue`) so requests stay fast.

---

## 7. Admin: overview, calendar, patient file

### 🛡 `GET /admin/stats`

```json
{
  "today_appointments": 8,
  "upcoming_appointments": 42,
  "month_revenue": 12450,
  "previous_month_revenue": 10800,
  "new_patients_month": 37,
  "previous_new_patients_month": 29,
  "cancellation_rate": 0.06,
  "appointments_by_day": [{ "date": "2026-11-01", "count": 5 }],
  "revenue_by_month":   [{ "month": "2026-06", "revenue": 9100 }],
  "services_breakdown": [{ "service": "General Checkups", "count": 61 }],
  "today": [ /* today's appointments with user, ordered by time */ ]
}
```

`appointments_by_day` = last 30 days; `revenue_by_month` = last 6 months, revenue = sum of `price` where `payment_status = paid` (+ completed pay-in-person).

### 🛡 `GET /admin/appointments/calendar?from=2026-11-23&to=2026-11-29&doctor_id=`

Non-paginated array of appointments (with `user`) in the range, excluding nothing (UI greys out cancelled).

### 🛡 `PUT /admin/appointments/{id}` — extend existing

Accepts any of `{ status, date, time, doctor_id, doctor }`. When date/time/doctor change → availability check (422 if taken) and notify the patient.

### 🛡 Patient file

| Method | Path | Response / Body |
| --- | --- | --- |
| GET | `/admin/users/{id}` | `{ user, second_registration, appointments: [...], notes: [{ id, body, created_at, author: { id, name } }] }` |
| POST | `/admin/users/{id}/notes` | `{ body }` → note |
| DELETE | `/admin/notes/{id}` | — |

```php
Schema::create('patient_notes', function (Blueprint $t) {
    $t->id();
    $t->foreignId('user_id')->constrained()->cascadeOnDelete();   // patient
    $t->foreignId('author_id')->constrained('users');               // admin
    $t->text('body');
    $t->timestamps();
});
```

---

## 8. Invoices

No endpoint needed — PDFs are generated in the browser from the appointment data. If you later want server-side invoice numbers, add `invoice_number` to appointments and the UI will print it when present.
