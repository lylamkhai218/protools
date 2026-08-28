# PROJECT CONSTITUTION & OPERATIONAL PRINCIPLES

## 1. NGUYÊN TẮC BẢO TOÀN TRI THỨC (APPEND-ONLY RULE)
> [!IMPORTANT]
> Mọi Agent khi làm việc trên dự án này nếu có kiến thức mới, sự cố mới hoặc quyết định kỹ thuật mới phát sinh **CHỈ ĐƯỢC PHÉP GHI THÊM (APPEND-ONLY)** vào cuối các mục tương ứng. CẤM TUYỆT ĐỐI việc xóa bỏ, sửa đổi làm mất hoặc ghi đè các bài học và quy tắc đã tích lũy.

## 2. NGUYÊN TẮC VẬN HÀNH CỐT LÕI (CORE PRINCIPLES)
1. **Project-First, Agent-Second:** Tri thức dự án lưu trữ trong kho tài liệu `.project/`, `.memory/`, `.tasks/` là nguồn chân lý duy nhất (Single Source of Truth).
2. **Progressive Context Loading:** Thứ tự nạp ngữ cảnh tối ưu:
   1. `AGENTS.md`
   2. `.project/snapshot.md`
   3. Task liên quan trong `.tasks/`
   4. Yêu cầu & Quyết định liên quan (`.project/requirements/`, `.project/decisions/`)
   5. Mã nguồn liên quan (`src/`)
3. **Minh bạch thông tin (Explicit Knowledge > Hidden Assumptions):** Mọi phát hiện, ràng buộc, giả định phải được dán nhãn (`KNOWN`, `ASSUMED`, `UNVERIFIED`, `DECIDED`, `DEPRECATED`).
4. **Không tùy tiện đổi kiến trúc (No Architecture by Drift):** Mọi thay đổi kiến trúc lớn phải thông qua phản biện (Critical Thinking) và ghi nhận vào `.project/decisions/` (ADR).
5. **Traceability bắt buộc:** `BUS-* (Mục tiêu) → FR/NFR-* (Yêu cầu) → UC-* (Use Case) → Design/Diagram → TASK-* → Code → TEST-*`.
6. **Preserve Reversibility:** Ưu tiên các giải pháp có thể hoàn tác (Rollback), bảo tồn đường dẫn SEO cũ và cấu trúc URL công khai.

## 3. NGUYÊN TẮC AN NINH MẠNG BẮT BUỘC (CRITICAL SECURITY RULES)
1. **Cấm tuyệt đối HTTP SQL Bridges:** Không tải lên bất kỳ script trung gian nào (`ntunnel_mysql.php`, `adminer.php`, v.v.) lên `public_html`. Tường lửa Imunify360 (Rule `77218530`) sẽ kích hoạt Auto-Ban tức thì.
2. **Quy chuẩn CSDL:** Thao tác DB qua phpMyAdmin DirectAdmin hoặc kết nối Read-Only Navicat sau khi đã khai báo IP tại Access Hosts.
3. **Quy trình Release:** Mọi bản phát hành phải qua script tự động sao lưu [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).
