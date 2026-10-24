<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public site reads shows/menu/promotions directly from the browser client with realtime (src/lib/data.ts) so admin edits appear instantly; RLS restricts writes to the admin role.
- Admin role: first account created is auto-granted admin by a database trigger; /admin is client-only.
- Photos go to a private storage bucket (public buckets are blocked) and are stored as 10-year signed URLs.
