# Lonqq Study AI V5 — Conceptual Learning

Bản Study AI một người dùng, phát triển tiếp từ V4.2. Bản này ưu tiên **học hiểu và vận dụng**: AI tạo câu hỏi mới từ **khái niệm và nguyên lý** tìm trong file, không chỉ hỏi “câu nào xuất hiện trong tài liệu”.

## Khởi động — wizard 6 bước

1. **Mục tiêu**: Ôn thi / Hiểu sâu / Vận dụng.
2. **Môn học**: dùng môn hiện có hoặc tạo mới.
3. **Nguồn**: upload PDF, DOCX, PPTX, TXT, MD, CSV, HTML, ảnh có OCR.
4. **Kế hoạch**: ngày thi, điểm mục tiêu, số phút học/ngày.
5. **Cấu hình kiểm tra**: MCQ, Đúng/Sai, Tự trả lời; tỷ lệ Dễ / Trung bình / Vận dụng / Vận dụng cao (tổng 100%); số câu 8–120.
6. **Xác nhận**: kiểm tra trạng thái AI Cloud, nhập PIN và tạo ngân hàng câu hỏi.

V5 vẫn có Dashboard, Smart Text, Quiz, Flashcards, Free Recall, Exam, Review, Mastery, Planner và chatbot của V4.2.

## Khác V4.2 ở chỗ nào?

**Generator chính (`/api/generate`):**
- Gửi **chỉ những đoạn nguồn được lấy từ tài liệu** trên thiết bị, không tải toàn bộ file lên backend.
- Dùng LLM tạo câu hỏi kiểm tra *meaning/why/compare/apply/diagnose/analysis* thay vì trích câu, điền khuyết.
- Schema câu hỏi: loại câu, mức độ, kỹ năng tư duy, đề bài, lựa chọn/đáp án, giải thích, source ID và câu chứng minh nguyên văn.
- Kiểm tra hình dạng và kiểm tra **trích dẫn có tồn tại nguyên văn** trong các đoạn nguồn được gửi.
- Gửi bộ câu hỏi cho một lượt **AI verifier** riêng để kiểm tra câu hỏi, đáp án, phương án nhiễu, mức độ và bằng chứng; không đạt thì loại bỏ.
- Không ép đủ số câu nếu tài liệu mỏng hoặc nhiều câu không qua kiểm tra.
- Tự gom ngân hàng, lọc câu lặp, giữ ID ổn định với câu được tạo giống nhau.
- Nếu cloud không cấu hình, **không giả vờ** tạo câu hỏi theo khái niệm. Có nút offline generator **cũ** được ghi rõ “Dùng mẫu offline (cơ bản)”.

**Cảnh báo:** kiểm tra bằng LLM và đối chiếu trích dẫn giảm rủi ro sai, **không bảo đảm 100% câu hợp lệ**. Với bài thi quan trọng hãy rà lại câu hỏi khó và nguồn trước khi tin tưởng.

## Đưa lên HTTPS để dùng thật trên iPhone

1. Giải nén thư mục này và deploy lên dịch vụ hỗ trợ serverless functions (ví dụ Vercel) cùng các file `index.html`, `api/chat.js`, `api/generate.js`, `package.json`, `vercel.json`.
2. Trong project hosting, đặt các **biến môi trường phía server**:
   - `OPENAI_API_KEY`: OpenAI API key của bạn.
   - `STUDY_APP_PIN`: mã PIN riêng **dài và khó đoán** để bảo vệ endpoint AI; bắt buộc.
   - `OPENAI_MODEL=gpt-4.1-mini` (có thể chọn model khác tài khoản API hỗ trợ).
   - Có thể đặt `OPENAI_GENERATOR_MODEL`, `OPENAI_VERIFIER_MODEL`, `AI_MIN_CONFIDENCE`.
3. Deploy. Chỉ khi có URL HTTPS và endpoint `/api/generate` được cấu hình thì tính năng tạo câu hỏi theo khái niệm mới gọi AI thật.
4. Mở URL trên Safari → Share → Add to Home Screen.
5. Ở bước 6 trong wizard, nhập `STUDY_APP_PIN` để sử dụng AI.

**Lưu ý chi phí:** ChatGPT Plus không tự cấp API key hay lượt API cho web riêng; chi phí OpenAI API được tính riêng. Tạo câu hỏi hiện có **hai lượt model** (generation + verification) mỗi batch. Lần đầu đọc PDF / OCR có thể cần Internet.

## Bảo mật và riêng tư

- Browser lưu workspace + dữ liệu học ở IndexedDB.
- Model chỉ nhận các **đoạn được trích xuất** từ file, câu hỏi và metadata liên quan, không nhận nguyên file PDF/PPT.
- Nội dung các đoạn được gửi đến OpenAI API khi dùng AI Cloud (không phải thuần offline). Không upload tài liệu nhạy cảm nếu không muốn gửi trích đoạn lên AI.
- API key chỉ nằm ở server. `STUDY_APP_PIN` bảo vệ endpoint AI, không phải hệ thống đăng nhập tài khoản đầy đủ; các file frontend vẫn có thể xem công khai nếu site public.
- Sao lưu bằng mục **Backup**; bộ nhớ Safari bị xóa có thể làm mất dữ liệu local.

## Hạn chế hiện tại

- **Không có live HTTPS URL** trong gói tải; phải deploy (đây là vấn đề khiến việc bấm HTML trong ChatGPT trên iPhone chưa giống mở Astra).
- Bản HTML mở trực tiếp chỉ xem được giao diện/setup, ôn offline bằng generator cũ; **không thể** bật Real AI Generator khi thiếu backend.
- Chấm Free Recall hiện vẫn có phần so từ khóa theo nội dung nguồn, **chưa phải semantic grading** bằng LLM.
- OCR, sơ đồ, bảng, công thức và slide phức tạp có thể bị trích xuất thiếu.
- Chưa có podcast/vấn đáp giọng nói như một số tính năng Astra.
