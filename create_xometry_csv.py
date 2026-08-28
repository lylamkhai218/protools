import csv

data = [
    # Category, Method EN, Method VN
    ("1. CNC Machining", "Milling", "Phay CNC 3 trục / 4 trục (Vertical / Horizontal Machining Center)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Milling 5 axes", "Phay CNC 5 trục đồng thời / 3+2 trục chính xác cao", "FALSE", "", "", ""),
    ("1. CNC Machining", "Milling mass", "Phay sản xuất hàng loạt / khối lượng lớn (Mass Production)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Turning", "Tiện CNC tiêu chuẩn (2 trục X, Z)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Turning 2+ axes", "Tiện CNC đa trục (Tiện phay kết hợp Live Tooling / C-axis, Y-axis)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Turning Automat", "Tiện đùn tự động kiểu Thụy Sĩ (Swiss Lathe / Auto Screw Machining)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Grinding", "Mài chính xác (Mài phẳng Surface, mài tròn Cylindrical, mài vô tâm)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Polishing", "Đánh bóng cơ học / Hoàn thiện bóng gương bề mặt chi tiết", "FALSE", "", "", ""),
    ("1. CNC Machining", "Slotting", "Xọc rãnh then / Cắt rãnh kỹ thuật (Slotting / Broaching)", "FALSE", "", "", ""),
    ("1. CNC Machining", "Liner Honing", "Doa chính xác / Đánh bóng honing lòng xi lanh, ống lót", "FALSE", "", "", ""),
    ("1. CNC Machining", "Thread Rolling", "Cán ren / Lăn ren áp lực cao (Độ bền ren vượt trội)", "FALSE", "", "", ""),

    ("2. Sheet Metal & Fabrication", "Laser Cutting", "Cắt Laser Fiber kim loại tấm (Thép, Inox, Nhôm, Đồng)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Waterjet Cutting", "Cắt tia nước có hạt mài (Cắt kim loại dày, đá, composite, không sinh nhiệt)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Plasma/Gas Cutting", "Cắt Plasma CNC / Cắt Oxy-Gas bản mã thép tấm dày", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Bending Sheet", "Chấn / Gập tôn tấm CNC (Press Brake)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Bending Tube", "Uốn ống kim loại định hình (Tube Bending)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Bending Wire", "Uốn dây kim loại / Dây thép định hình CNC (Wire Bending)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Bending bar", "Uốn thanh / Thép hình / Thép cây (Bar Bending)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Punching", "Đột dập CNC kim loại tấm (CNC Turret Punching)", "FALSE", "", "", ""),
    ("2. Sheet Metal & Fabrication", "Stamping", "Dập định hình liên hoàn / Dập khuôn khối (Progressive / Deep Draw Stamping)", "FALSE", "", "", ""),

    ("3. Casting, Molding & Forming", "Sand molded casting", "Đúc khuôn cát (Sand Casting) - Gang, Thép, Hợp kim", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Metal Injection Molding", "Ép phun kim loại (MIM) - Chi tiết nhỏ, độ phức tạp cao", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Compression Molding", "Ép nén định hình (Cao su, composite, nhựa nhiệt rắn)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Investment Casting", "Đúc mẫu chảy chính xác (Đúc sáp / Mất sáp Lost-wax Casting)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Ceramic Injection Molding", "Ép phun gốm kỹ thuật cao (CIM)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "LSR Injection Molding", "Ép phun cao su Silicone lỏng (Liquid Silicone Rubber)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Die cutting", "Bế cắt khuôn định hình (Gioăng, seal, màng nhựa, đệm xốp)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Extrusion", "Đùn ép định hình (Đùn nhôm định hình, đùn nhựa profile)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Pressure Forming", "Tạo hình áp lực cao kim loại / tấm", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Twin Sheet Forming", "Định hình nhiệt hai tấm rỗng chân không (Twin Sheet Thermoforming)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Injection Molding", "Ép phun nhựa nhiệt dẻo tiêu chuẩn (Plastic Injection Molding)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "In-Mold Decoration", "Trang trí bề mặt trong khuôn đúc (IMD)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "In-Mold Filming", "Dán màng hoa văn kỹ thuật trong khuôn (IMF)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Die Casting", "Đúc áp lực cao buồng nóng/buồng lạnh (Nhôm, Kẽm, Magie)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Vacuum Casting", "Đúc hút chân không khuôn silicon (Tạo mẫu nhanh nhựa PU/ABS)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Thermoforming", "Định hình nhiệt chân không tấm nhựa (Thermoforming)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Blow Molding", "Ép thổi rỗng chai, can, thùng chứa (Blow Molding)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Foam Molding", "Đúc tạo hình bọt xốp / Mút định hình (Foam Molding)", "FALSE", "", "", ""),
    ("3. Casting, Molding & Forming", "Vacuum Forming", "Hút nổi định hình chân không màng mỏng (Vacuum Forming)", "FALSE", "", "", ""),

    ("4. 3D Printing & Additive", "3D Printing (SLS)", "In 3D thiêu kết laser chọn lọc bột nhựa (Selective Laser Sintering - PA12/Nylon)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (MJF)", "In 3D công nghệ Multi Jet Fusion (HP MJF - Nhựa kỹ thuật chịu lực)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (SLA)", "In 3D quang trùng hợp nhựa lỏng độ mịn cao (Stereolithography - Resin)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (FDM)", "In 3D đùn sợi nhựa nhiệt dẻo (Fused Deposition Modeling - PLA/ABS/PETG/PEEK)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (DLS)", "In 3D ánh sáng kỹ thuật số siêu tốc (Digital Light Synthesis - Carbon DLS)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (DMLS)", "In 3D thiêu kết laser kim loại trực tiếp (Direct Metal Laser Sintering - Inox, Titan, Nhôm)", "FALSE", "", "", ""),
    ("4. 3D Printing & Additive", "3D Printing (Polyjet)", "In 3D phun hạt photopolymer đa vật liệu / đa màu sắc (PolyJet)", "FALSE", "", "", ""),

    ("5. Other Methods", "Tooth Gear", "Gia công chế tạo bánh răng (Phay lăn răng Hobbing, xọc răng, mài răng chính xác)", "FALSE", "", "", ""),
    ("5. Other Methods", "EDM", "Gia công tia lửa điện (Cắt dây Wire-EDM & Xung định hình Die-Sinker EDM)", "FALSE", "", "", ""),
    ("5. Other Methods", "Assembly", "Lắp ráp cụm chi tiết cơ khí, đóng gói module (Mechanical Assembly)", "FALSE", "", "", ""),
    ("5. Other Methods", "Welding Steel", "Hàn kết cấu thép (Hàn MIG, MAG, TIG, que hàn tiêu chuẩn)", "FALSE", "", "", ""),
    ("5. Other Methods", "Welding Alu", "Hàn nhôm và hợp kim nhôm chuyên dụng (AC TIG / Pulse MIG)", "FALSE", "", "", ""),
    ("5. Other Methods", "Welding Stainless Steel", "Hàn inox / thép không gỉ thẩm mỹ & vi sinh (Sanitary TIG)", "FALSE", "", "", ""),
    ("5. Other Methods", "Molds&Dies", "Thiết kế & Chế tạo khuôn mẫu chính xác (Khuôn ép nhựa, khuôn dập kim loại)", "FALSE", "", "", ""),
    ("5. Other Methods", "Assembly machining", "Gia công cơ khí tinh chỉnh sau khi đã lắp ghép cụm chi tiết", "FALSE", "", "", ""),

    ("6. Post Processing", "Post Processing", "Xử lý nhiệt luyện (Tôi, thấm Carbon, ram) & Xử lý bề mặt (Anodize, Xi mạ Niken/Kẽm, Sơn tĩnh điện, Bắn cát)", "FALSE", "", "", "")
]

headers = ["STT", "Nhóm công nghệ (Category)", "Phương pháp sản xuất (EN)", "Dịch nghĩa kỹ thuật & Diễn giải (VN)", "Đạt (TRUE/FALSE)", "Quy mô máy / Thông số", "Dung sai / Tiêu chuẩn", "Ghi chú"]

with open("d:/T&TVina/protools/Xometry_Production_Competencies_Bilingual.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    for i, row in enumerate(data, 1):
        writer.writerow([i, row[0], row[1], row[2], row[3], row[4], row[5], row[6]])

print("CSV created successfully")
