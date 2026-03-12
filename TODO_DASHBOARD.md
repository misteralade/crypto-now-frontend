# Dashboard TODO — Post-Redesign

## 1. Notifications System
- Backend: Create notifications API (`GET /notifications`, `PATCH /notifications/:id/read`)
- Frontend: Wire `Bell` icon in `AuthenticatedLayout.tsx` header to real unread count
- Frontend: Build `/dashboard/notifications` route + page
- Reference: Bell button is at `src/layouts/AuthenticatedLayout.tsx` (desktop header + mobile tab)

## 2. KYC Verification Status
- Backend: Expose KYC tier on user profile response (`GET /user/profile`)
- Frontend: Replace static "KYC Verified" pill in `DashboardContent.tsx` and `ProfilePage.tsx`
  with real `userProfileData.kycStatus` check
- Show "KYC Pending" / "Complete KYC" CTA when not verified
- Files: `src/sections/dashboard/DashboardContent.tsx` (line ~115), `src/pages/ProfilePage.tsx` (line ~130)

## 3. Live Rates Ticker Auto-refresh
- Currently uses `supportedCryptoCurrencies` from `useCryptoQuery` (includes buyRate/sellRate)
- Add `refetchInterval: 30_000` to the crypto query for real-time rate updates on dashboard
- File: `src/queries/crypto.query.ts`
