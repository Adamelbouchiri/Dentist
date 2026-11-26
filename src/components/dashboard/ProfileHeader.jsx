import { FiCalendar, FiShield } from "react-icons/fi";
import { Avatar } from "../ui/Misc";

const accountType = (user) =>
  user?.google_id ? "Google account" : user?.facebook_id ? "Facebook account" : "Email account";

const memberSince = (user) =>
  user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

/** Hero card with banner, avatar and account meta. `avatarSlot` lets Settings add an upload button. */
export const ProfileHeader = ({ user, avatarSlot, action }) => (
  <div className="overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-ink-200/70">
    <div className="relative h-32 gradient-primary md:h-40">
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.15)_1px,transparent_1px)] [background-size:20px_20px]" />
      <img src="/images/logo-icon.png" alt="" className="absolute -bottom-8 right-8 w-40 opacity-15 brightness-0 invert" />
    </div>
    <div className="flex flex-col gap-6 px-6 pb-8 md:flex-row md:items-end md:gap-8 md:px-10">
      <div className="relative -mt-14 w-fit shrink-0">
        <Avatar user={user} className="size-28 text-3xl ring-[6px] ring-white shadow-soft" rounded="rounded-[28px]" />
        {avatarSlot}
      </div>
      <div className="flex-1 md:pt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-ink-900 md:text-3xl">{user?.name}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        </div>
        <p className="mt-2 text-ink-500">{user?.email}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-[13px] font-medium text-ink-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 ring-1 ring-ink-200/70">
            <FiCalendar className="size-3.5 text-primary-500" /> Member since {memberSince(user)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 ring-1 ring-ink-200/70">
            <FiShield className="size-3.5 text-primary-500" /> {accountType(user)}
          </span>
        </div>
      </div>
      {action}
    </div>
  </div>
);
