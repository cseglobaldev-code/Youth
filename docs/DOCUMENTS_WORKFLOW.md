# Documents, Archived Versions và trang pháp lý

Ngày kiểm tra tài liệu nền tảng: November 05, 2026.

## Một nguồn dữ liệu trong Strapi

Website đọc collection **Documents** (`policy-documents`). Không còn trộn danh sách Documents tĩnh trong frontend với dữ liệu CMS. Các file cũ vẫn được giữ; mục chưa được gán Section hiển thị trong Other documents. Link JD trong form Individual và Hero đi qua trang `/policy-documents/continental-directors-jd`, nên thay nguồn JD trong Strapi sẽ được dùng chung. PDF cũ vẫn là nguồn khởi tạo, không bị xóa.

| Website Section | Nhóm | Cách hiển thị |
| --- | --- | --- |
| Y.O.U Charter; Governance Policy; Code of Conduct; Donation Terms; Community & Content Guidelines | Governance Documents | Trang nội dung / link hiện hành và Archived versions |
| Protocol; Bluebook | Governance Documents | Google Slides hoặc danh sách ảnh slide; không hiện Archived versions |
| Membership Agreement; Operational Guidelines | Membership Documents | Trang nội dung / link hiện hành và Archived versions |
| Careers | Membership Documents | Africa, America, Asia, Australia, Europe; hồ sơ dùng chung nằm ở Shared career documents |
| Annual Report | Annual Reports | Image card; ảnh bìa thay được trong Strapi |
| Terms of Service; Privacy Policy | Footer | Trang nội dung trực tiếp; chỉnh được trong Strapi |

Tên nhóm trên website là cấu trúc cố định theo yêu cầu. Hồ sơ bên trong, nội dung, link, phiên bản, ngày, ảnh bìa và ảnh slide lấy từ Strapi. Nhóm rỗng không tạo tài liệu giả.

## Team Trợ lý cập nhật thế nào

1. Mở **Strapi → Content Manager → Documents**. Có thể dùng **Portal → Documents** để sửa metadata và các đoạn văn cơ bản; Strapi có trình soạn thảo Blocks đầy đủ cho ảnh, link, danh sách và định dạng.
2. Chọn hoặc tạo entry. Điền Title, Website Section và Stable Page Slug. Giữ slug ổn định sau khi đã chia sẻ link trang.
3. Careers: chọn Continent; bỏ trống nếu tài liệu dùng chung. Section tự quyết định category và display mode để tránh gán lệch hai trường.
4. Điền Version, ví dụ `0.0`, và Effective / Report Date. Chú thích website là `v0.0 - September 09, 2026`. Version không tự tăng vì team cần quyết định phiên bản nội dung.
5. Với tài liệu bên ngoài, nhập Public Source Link. Nếu có, nhập riêng Published Embed URL. Chỉ dán URL HTTPS, không dán thẻ `<iframe>`. Tài liệu Google cần có quyền xem công khai hoặc Publish to web.
6. Embedded Page Content là nội dung trình bày ngay trên website. Đây là một trường Blocks trong entry, không phải một collection/trang tĩnh thứ hai. Có thể thêm giới thiệu và link nguồn ngoài tại đây.
7. Annual Reports: chọn Annual Report Card Image và Effective / Report Date. Không phải thay code để đổi ảnh. Chưa có ảnh thì card có nền dự phòng, không dùng ảnh minh họa giả.
8. Protocol / Bluebook: dùng URL Google Slides đã publish hoặc tải Slide Images theo thứ tự. Website có Previous / Next khi dùng ảnh slide.
9. **Save draft** để lưu bản nháp. **Publish / Save & Publish** để cập nhật bản công khai. Bản nháp không làm thay đổi trang đang public. Website kiểm tra lại khi mở trang, quay lại tab và mỗi 30 giây khi tab đang hiển thị; mạng hoặc dịch vụ nguồn lỗi có thể làm chậm việc cập nhật.
10. Gỡ khỏi website bằng **Unpublish** trong Strapi. Chỉ Delete nếu muốn xóa cả hồ sơ. Website không tự thêm tài liệu tĩnh trở lại sau khi gỡ.

Link folder và các nền tảng không hỗ trợ iframe mở sang tab nguồn. Preview chỉ được tải khi người xem nhấn nút; trang Documents không tải tất cả iframe cùng lúc. Một số nguồn chặn nhúng dù link công khai: dùng nút Open document thay thế.

## Archived versions phải giữ đúng nội dung cũ

1. Trước khi thay nội dung hiện hành, tạo bản sao riêng của file/trang cũ trên nền tảng nguồn; đặt tên gồm phiên bản và ngày.
2. Đặt bản sao ở quyền xem; team không tiếp tục sửa bản sao đó.
3. Trong entry gốc → Archived Versions → Add, điền Version, Date, Archived Public Link; thêm Embed URL nếu có.
4. Cập nhật link/nội dung hiện hành, phiên bản và ngày hiệu lực; Publish.
5. Mở trang hồ sơ trên website → Archived versions, kiểm tra bản hiện hành và bản cũ khác nhau đúng nội dung.

Website không tải về và chụp nội dung của website ngoài. Dùng lại cùng URL đang được chỉnh sửa sẽ không tạo bản lưu trữ cố định. Danh sách archive không thay thế cơ chế sao lưu cơ sở dữ liệu.

## Terms of Service / Privacy Policy

- Footer dẫn đến `/terms-of-service` và `/privacy-policy` trên website.
- Nội dung ban đầu lấy từ toàn bộ **11 trang TERMS OF SERVICE.pdf** và **6 trang PRIVACY POLICY.pdf** do người dùng cung cấp. Giữ nội dung, bỏ dòng Last Updated in sẵn để tránh hai ngày cập nhật khác nhau. Metadata nguồn và SHA-256 nằm trong backend `src/data/legal-documents.json`.
- Nội dung chỉ nằm trong CMS, không nhúng PDF nặng hoặc một bản pháp lý tĩnh khác trong bundle frontend.
- **Last Updated** được định dạng từ `updatedAt` của bản đã publish: `Last Updated: October 12, 2026`. Khi publish sửa đổi, ngày tự thay theo dữ liệu lưu thật. Ngày khởi tạo lần đầu là thời điểm tạo/publish entry, không giả thành ngày hôm trước; Effective Date vẫn có thể giữ ngày hiệu lực từ PDF.
- Hai permalink pháp lý được giữ cố định từ Section; đổi tiêu đề không làm hỏng link footer.
- Nếu cần công khai lịch sử pháp lý, thêm Archived Versions giống quy trình trên.

## Nền tảng ngoài miễn phí: đề xuất

| Phương án | Soạn nội dung, hình ảnh, public link | Phân tầng/link nhỏ | Giới hạn và lựa chọn |
| --- | --- | --- | --- |
| **Google Drive + Docs / Slides / Sheets** | Cộng tác soạn nội dung; Publish to web tạo URL để mở hoặc nhúng; Slides phù hợp Protocol/Bluebook | Folder tổng, file riêng; Docs có link heading/bookmark, Sheets có sheet/range link | Google Account có tối đa 15 GB dùng chung Drive/Gmail/Photos. Đề xuất làm nguồn tài liệu chính vì team đã dùng Drive. |
| **Google Sites + Drive** | Trang hub với văn bản, ảnh/GIF và nội dung Drive nhúng | Trang và trang con; phù hợp mục lục thư viện | Là lớp tổ chức nội dung, không tạo thêm quota lưu trữ Drive. Website Y.O.U nên mở link Sites thay vì giả định Sites luôn nhúng được vào iframe. Có thể mở rộng thành hub tham khảo cho Member Portal. |
| **Notion Free** | Trang public dễ biên tập; có cơ sở dữ liệu và trang con | Page/subpage, link block cụ thể | Free có giới hạn 5 MB/file; workspace nhiều thành viên có giới hạn block, lịch sử 7 ngày. Phù hợp văn bản/knowledge hub nhỏ; kém phù hợp kho ảnh/tài liệu lớn cho nhiều biên tập viên. Link Notion mở tab nguồn. |

**Lựa chọn đề xuất:** Google Drive lưu file và archive; Docs lưu văn bản, Slides lưu trình chiếu, Sheets lưu mục lục nếu cần; Strapi giữ danh mục, ngày, phiên bản, URL và quyền publish lên Y.O.U. Google Sites là hub tùy chọn sau này, không cần triển khai thêm ngay.

Các nguồn miễn phí không được coi là dịch vụ có dung lượng/truy cập đồng thời vô hạn. Google hướng dẫn tối đa 100 người cùng cộng tác trên một Docs/Sheets/Slides, và dùng Publish to web cho lượng người xem lớn. Cần phân biệt người cùng sửa với người chỉ xem trang đã publish. Publish to web có thể chậm vài phút sau thay đổi; đó là thời gian của Google, tách với chu kỳ tải lại 30 giây của website.

Nếu sửa nội dung trực tiếp trên Google mà không sửa entry Strapi, nội dung Google có thể tự cập nhật, nhưng Version/Effective Date trong Strapi không tự tăng. Ngày Last Updated tự động nêu trên dành cho nội dung pháp lý chỉnh trong Strapi.

Nguồn chính thức đã kiểm tra:

- [Google Account storage](https://support.google.com/accounts/answer/6374270?hl=en)
- [Publish Docs, Sheets, Slides; embed và tự cập nhật](https://support.google.com/docs/answer/183965?hl=en)
- [Google cộng tác và giới hạn 100 người](https://support.google.com/a/users/answer/9305685?hl=en)
- [Google Sites: nội dung, hình ảnh, file và embed](https://support.google.com/sites/answer/90569?hl=en)
- [Google Docs: bookmarks và headings](https://support.google.com/docs/answer/45893?hl=en)
- [Notion Free và các giới hạn](https://www.notion.com/pricing)
- [Notion Sites availability](https://www.notion.com/en-gb/help/notion-sites-availability-and-pricing)

## Triển khai và kiểm tra

1. Sao lưu database Strapi, giữ nguyên volume/database và media hiện tại.
2. Triển khai backend `youth-cms` trước. Strapi bổ sung thuộc tính và bảng component archive theo schema; không xóa các cột/file cũ. Đây vẫn là cập nhật schema database, nên không gọi là “không có migration”. Không cần lệnh SQL tay khi Strapi đang dùng cơ chế đồng bộ schema mặc định.
3. Bootstrap chạy một lần: tạo hai trang pháp lý có nội dung, mẫu nháp cho các nhóm/Careers, đưa JD hiện có vào CMS nếu chưa có entry cùng tiêu đề. Không xuất bản hồ sơ có nội dung/link chưa được cung cấp. Không ghi đè lần sau vào nội dung team đã sửa.
4. Kiểm tra các trường mới trong Content Manager; account của team cần quyền cập nhật/publish Documents. Portal hiện dùng cơ chế xác thực sẵn có của dự án.
5. Triển khai frontend. Token đọc CMS chỉ cần quyền đọc; giữ token sửa nội dung riêng trong phiên Portal. Không đưa token vào file public.
6. Mở `/policy-documents`, `/terms-of-service`, `/privacy-policy`; kiểm tra cả desktop/mobile.
7. Sửa một đoạn Privacy Policy → Save draft → website vẫn bản cũ → Publish → website thấy bản mới sau tải lại, Last Updated theo timestamp đã lưu.
8. Kiểm tra một entry Charter với URL hiện hành và một archive khác URL. Protocol/Bluebook không có selector Archived versions. Careers có đủ 5 nhóm; Annual Report đổi ảnh bìa được.
9. Unpublish một tài liệu, xác nhận biến mất khỏi danh sách; mở link cũ báo chưa được publish. Không có fallback tĩnh làm nó hiện lại.

Chưa có trong dữ liệu người dùng: public link/nội dung của các hồ sơ Governance/Membership còn lại; file annual report, ảnh bìa và hai ảnh tham chiếu annual card. Cần team nhập/publish những nội dung đó; không tự điền tài liệu pháp lý hoặc link giả.
