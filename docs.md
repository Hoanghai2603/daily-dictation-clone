Nhiệm vụ: Build 1 project học Tiếng anh dựa theo website bên dưới
Website: https://dailydictation.com/
Tác vụ hiện tại chỉ là: Brainstorm, liệt kê toàn bộ feature và ghi các requirement của các feature để chuẩn bị dựa theo file này để build dự án

Về tech sẽ chia ra 2 Repo

Repo Frontend
+ Admin vs Client ( cả đều build cùng 1 repo , và sử dụng monorepo để quản lý )
- Tech của các Frontend
+ Admin ( React )
+ Client ( Next, i18n - next-intl )

-> cả 2 đều dùng, Tailwind, Shadcn, Tanstack, biomejs, Typescript, zustand

- quy định i18n của Client là (tên feature)_(text)
ex: auth_enter_your_password ( tính năng đăng nhập. có text là enter your password )

- nếu nó có các từ chung chung mà dùng cho ở các chỗ như button thì sẽ gọi là
+ common_submit
+ common_cancel

Về giao diện client t mong muốn là y chang 100% Website đã gửi
Admin thì sẽ research các UI trên mạng sao cho nó hợp lý 

-> cả 2 đều dùng, Tailwind, Shadcn, Tanstack, biomejs, Typescript, zustand


Repo Backend:
Tech: Nodejs - supabase 

-> Tác vụ hiện tại chỉ là brainstorm, liệt kê feature và ghi rõ các requirement của website chứ không cần phải code gì cả
