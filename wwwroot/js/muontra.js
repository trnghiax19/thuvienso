
(function ($) {
  "use strict";

  // chạy khi DOM sẵn sàng
  $(function () {

    var $mainTabs = $(".main-tabs li");
    var $tabContents = $(".tab-content");

    // helper: show target, hide others
    function showTab(tabId) {
      // 1) remove active trên tab list
      $mainTabs.removeClass("active");
      $mainTabs.filter('[data-tab="' + tabId + '"]').addClass("active");

      // 2) ẩn tất cả tab-content rồi hiện target
      $tabContents.hide();
      $("#" + tabId).show();

      // 3) Ẩn/hiện các phần rời rạc gắn data-tab-for
      // Các phần có data-tab-for="muontra-tab" sẽ hiển thị khi tabId === 'muontra-tab'
      $('[data-tab-for]').each(function () {
        var $el = $(this);
        var forAttr = $el.attr("data-tab-for"); // có thể là danh sách phân cách bằng space
        if (!forAttr) { $el.hide(); return; }
        var allowed = forAttr.split(/\s+/);
        if ($.inArray(tabId, allowed) !== -1) {
          $el.show();
        } else {
          $el.hide();
        }
      });

      // 4) update URL hash (không reload)
      try {
        history.replaceState && history.replaceState(null, null, "#" + tabId);
      } catch (e) { /* ignore */ }
    }

    // khởi tạo: nếu có hash trong URL => hiển thị tab đó, ngược lại tab active mặc định
    var hash = (window.location.hash || "").replace("#", "");
    if (hash && $("#" + hash).length) {
      showTab(hash);
    } else {
      // nếu không, tìm .main-tabs li.active
      var $active = $mainTabs.filter(".active").first();
      if ($active.length) {
        showTab($active.data("tab"));
      } else {
        // fallback: hiện tab đầu
        var first = $mainTabs.first().data("tab");
        showTab(first);
      }
    }

    // click handler
    $mainTabs.on("click", function (e) {
      e.preventDefault();
      var tabId = $(this).data("tab");
      if (!tabId) return;
      showTab(tabId);
    });

    // nếu muốn chuyển sub-tab khi đổi main tab: ẩn subtab container mặc định
    // (nếu không cần có thể bỏ)
    function resetSubtabs() {
      // nếu có subtab active bên trong muontra, giữ; nếu không, ẩn subtab container khi ra tab khác
      if (!$(".main-tabs li.active").data("tab") || $(".main-tabs li.active").data("tab") !== "muontra-tab") {
        $(".subtab-container").hide();
      } else {
        $(".subtab-container").show();
      }
    }
    // gọi lần đầu và khi đổi tab
    resetSubtabs();
    $mainTabs.on("click", resetSubtabs);

    // Optional: keyboard left/right để chuyển tab (nâng cao)
    $(document).on("keydown", function (ev) {
      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
        var $visible = $mainTabs.filter(".active");
        var idx = $mainTabs.index($visible);
        if (idx < 0) idx = 0;
        var nextIdx = idx + (ev.key === "ArrowRight" ? 1 : -1);
        if (nextIdx < 0) nextIdx = $mainTabs.length - 1;
        if (nextIdx >= $mainTabs.length) nextIdx = 0;
        $mainTabs.eq(nextIdx).trigger("click");
      }
    });

  });

})(jQuery);

// Đợi DOM load xong
document.addEventListener("DOMContentLoaded", function () {

    // ================== Xử lý Tabs ==================
    const mainTabs = document.querySelectorAll(".main-tabs li");
    mainTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Bỏ active tab cũ
            mainTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            // Ẩn tất cả nội dung tab
            const tabContents = document.querySelectorAll(".tab-content");
            tabContents.forEach(content => content.style.display = "none");

            // Hiện tab tương ứng
            const targetId = this.getAttribute("data-tab");
            const targetTab = document.getElementById(targetId);
            if (targetTab) targetTab.style.display = "block";
        });
    });


    // ================== Xử lý chọn trạng thái ==================
    const statusButtons = document.querySelectorAll(".btn-group:first-of-type .btn");
    statusButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            statusButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ================== Xử lý lọc đối tượng (Học sinh / Giáo viên) ==================
    const userButtons = document.querySelectorAll(".btn-group:nth-of-type(2) .btn");
    userButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            userButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ================== Nút tải lại ==================
    const reloadBtn = document.querySelector(".btn-default i.fa-refresh")?.closest("button");
    if (reloadBtn) {
        reloadBtn.addEventListener("click", function () {
            location.reload();
        });
    }

    // ================== Checkbox chọn tất cả ==================
    const masterCheckbox = document.querySelector("thead input[type='checkbox']");
    if (masterCheckbox) {
        masterCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
            checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
        });
    }
});



// HIỆN SUBTAB///////////////
document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll("#subTabGroup .btn");
    const tabContents = document.querySelectorAll(".subtab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Bỏ active ở nút cũ
            tabButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            // Ẩn tất cả nội dung
            tabContents.forEach((c) => (c.style.display = "none"));

            // Hiện nội dung đúng tab
            const targetId = this.getAttribute("data-subtab");
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = "block";
            }
        });
    });
});


//============= ĐĂNG KÝ MƯỢN =================//
document.addEventListener("DOMContentLoaded", function () {
    const btnMoModal = document.getElementById("btnMoModal");
    const btnLuu = document.getElementById("btnLuuDangKyMoi");
    const form = document.getElementById("formDangKyMoi");
    const tbody = document.querySelector("#tab-dangky tbody"); // Table có ID tab-dangky

    if (!btnMoModal || !btnLuu || !form || !tbody) {
        console.error("❌ Thiếu phần tử HTML cần thiết!");
        return;
    }

    // 👉 Mở modal
    btnMoModal.addEventListener("click", function () {
        $("#modalDangKyMoi").modal("show");
    });

    // 👉 Khi nhấn Lưu
    btnLuu.addEventListener("click", function () {
        const tv = form.querySelector("#dkThanhVien").value.trim();
        const nd = form.querySelector("#dkNhanDe").value.trim();
        const dk = form.querySelector("#dkSoDKCB").value.trim();
        const bia = form.querySelector("#dkBia").value.trim() || "https://via.placeholder.com/40x55?text=Book";
        const tt = form.querySelector("#dkTrangThai").value;

        if (!tv || !nd || !dk) {
            alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${tv}</td>
            <td>${nd}</td>
            <td>${dk}</td>
            <td><img src="${bia}" style="width:40px;height:55px;"></td>
            <td>${new Date().toLocaleDateString("vi-VN")}</td>
            <td><span class="label ${getLabelClass(tt)}">${tt}</span></td>
            <td>
                <button class="btn btn-xs btn-success">✔ Cho mượn</button>
                <button class="btn btn-xs btn-danger">✖ Hủy</button>
            </td>
        `;
        tbody.appendChild(row);

        $("#modalDangKyMoi").modal("hide");
        form.reset();
    });

    function getLabelClass(status) {
        switch (status) {
            case "Đã xác nhận": return "label-success";
            case "Chờ duyệt": return "label-warning";
            case "Đã hủy": return "label-default";
            default: return "label-info";
        }
    }
});

// NGÀY BẮT ĐẦU _ NGÀY KẾT THÚC 
$(function () {
    const $dateRange = $('#dateRange');

    $dateRange.daterangepicker({
        autoUpdateInput: false,
        locale: {
            applyLabel: 'Chọn',
            cancelLabel: 'Xóa',
            format: 'DD/MM/YYYY',
            separator: ' - ',
            daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
                'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
                'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ],
            firstDay: 1
        }
    });

    // Khi click icon thì mở lịch
    $('.input-group-addon').on('click', function () {
        $('#dateRange').trigger('click');
    });

    // Cập nhật giá trị khi chọn ngày
    $dateRange.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(`${picker.startDate.format('DD/MM/YYYY')} - ${picker.endDate.format('DD/MM/YYYY')}`);
    });

    // Xóa giá trị khi hủy
    $dateRange.on('cancel.daterangepicker', function () {
        $(this).val('');
    });
});




// MƯỢN SÁCH TRỰC TIẾP
document.addEventListener("DOMContentLoaded", function () {
    const btnMuonSach = document.getElementById("btnMuonSach");
    const muonSachModal = $("#muonSachModal");

    if (btnMuonSach && muonSachModal.length) {

        // Ngăn hành vi mặc định (nếu button nằm trong form hoặc có href="#")
        btnMuonSach.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Kiểm tra modal đã có class "in" chưa (Bootstrap 3 dùng class này)
            if (!muonSachModal.hasClass("in")) {
                muonSachModal.modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            }
        });

        // Nút "Thoát" hoặc "Đóng" trong modal
        $(document).on("click", "#muonSachModal .btn-danger", function (e) {
            e.preventDefault();
            muonSachModal.modal("hide");
        });

        // Khi modal đóng hoàn toàn
        muonSachModal.on("hidden.bs.modal", function () {
            document.body.classList.remove("modal-open");
            $(".modal-backdrop").remove();
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const chonSach = document.getElementById("chonSach");
    const tongSach = document.getElementById("tongSach");
    const soSachDangKy = document.getElementById("soSachDangKy");
    const bangSachMuonWrapper = document.getElementById("bangSachMuonWrapper");
    const bangSachMuonBody = document.querySelector("#bangSachMuon tbody");
    const btnXacNhanMuon = document.getElementById("btnXacNhanMuon");
    const soNgayMuon = 7;

    const danhSachMuon = [];

    chonSach.addEventListener("change", function () {
        const option = chonSach.options[chonSach.selectedIndex];
        if (!option.value) return;

        const today = new Date();
        const tra = new Date(today);
        tra.setDate(today.getDate() + soNgayMuon);

        const sach = {
            stt: danhSachMuon.length + 1,
            nhande: option.text,
            dkcb: option.dataset.dkcb,
            bia: option.dataset.bia,
            songay: soNgayMuon,
            ngaytra: tra.toLocaleDateString("vi-VN")
        };

        danhSachMuon.push(sach);
        renderTable();
        chonSach.value = "";
    });

    function renderTable() {
        bangSachMuonBody.innerHTML = "";
        danhSachMuon.forEach(function (sach, i) {
            const row = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${sach.nhande}</td>
                    <td><span class="label label-info">${sach.dkcb}</span></td>
                    <td><img src="${sach.bia}" width="40" height="55" class="img-thumbnail"></td>
                    <td>${sach.songay}</td>
                    <td>${sach.ngaytra}</td>
                </tr>`;
            bangSachMuonBody.insertAdjacentHTML("beforeend", row);
        });

        if (danhSachMuon.length > 0) {
            bangSachMuonWrapper.style.display = "block";
        }

        tongSach.textContent = danhSachMuon.length;
        soSachDangKy.textContent = danhSachMuon.length;
    }

    btnXacNhanMuon.addEventListener("click", function () {
        if (danhSachMuon.length === 0) {
            alert("⚠️ Vui lòng chọn ít nhất một sách để mượn!");
        } else {
            alert("✅ Mượn thành công " + danhSachMuon.length + " cuốn sách!");
            $("#muonSachModal").modal("hide");
        }
    });
});



// TRẢ SÁCH TRỰC TIẾP /////////////
document.addEventListener("DOMContentLoaded", function () {
    const btnTraSach = document.getElementById("btnTraSach");
    const traSachModal = $("#traSachModal");

    // Khi bấm nút "Trả Sách"
    btnTraSach.addEventListener("click", function (e) {
        e.preventDefault();
        traSachModal.modal({
            backdrop: 'static',
            keyboard: false
        });
        traSachModal.modal('show');
    });

    // Khi bấm nút Thoát hoặc đóng modal
    $(document).on("click", "#traSachModal .btn-danger, #traSachModal .close", function () {
        traSachModal.modal("hide");
    });

    // Fix lỗi backdrop còn sót
    traSachModal.on("hidden.bs.modal", function () {
        document.body.classList.remove("modal-open");
        $(".modal-backdrop").remove();
    });
});

// IN BIÊN NHẬN/////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Khi bấm nút "In biên nhận"
    $(document).on("click", ".btn-in-bien-nhan", function () {
        // Lấy thông tin dòng đang được in
        var row = $(this).closest("tr");
        var nguoiMuon = row.find("td:nth-child(2)").text().trim();
        var trangThai = row.find("td:nth-child(3)").text().trim();
        var tenSach = row.find("td:nth-child(4)").text().trim();
        var soDKCB = row.find("td:nth-child(5)").text().trim();
        var ngay = row.find("td:nth-child(7)").text().trim();

        // Tạo nội dung biên nhận
        var bienNhan = `
            <div style="font-family: Arial; padding: 20px;">
                <h3 style="text-align:center;">🧾 BIÊN NHẬN MƯỢN SÁCH</h3>
                <hr>
                <p><strong>Người mượn:</strong> ${nguoiMuon}</p>
                <p><strong>Trạng thái:</strong> ${trangThai}</p>
                <p><strong>Tên sách:</strong> ${tenSach}</p>
                <p><strong>Số ĐKCB:</strong> ${soDKCB}</p>
                <p><strong>Ngày mượn / trả:</strong> ${ngay}</p>
                <hr>
                <p style="text-align:center;">Cảm ơn bạn đã sử dụng thư viện 💚</p>
            </div>
        `;

        // Mở cửa sổ in
        var win = window.open("", "_blank");
        win.document.write(bienNhan);
        win.document.close();
        win.print();
    });
});



document.addEventListener("DOMContentLoaded", () => {
    // Xử lý khi nhấn "Cho mượn"
    document.querySelectorAll(".btn-success.btn-xs").forEach(btn => {
        btn.addEventListener("click", e => {
            const row = e.target.closest("tr");
            const thanhVien = row.querySelector("td:nth-child(2) strong")?.textContent.trim() || "";
            const nhanDe = row.querySelector("td:nth-child(3) strong")?.textContent.trim() || "";
            const soDKCB = row.querySelector("td:nth-child(4)")?.textContent.trim() || "";

            if (confirm(`📚 Xác nhận cho mượn:\n- Thành viên: ${thanhVien}\n- Sách: ${nhanDe}\n- Số ĐKCB: ${soDKCB}`)) {
                row.querySelector("td:nth-child(7)").innerHTML = `<span class="label label-primary">Đang mượn</span>`;
                btn.disabled = true;
                btn.innerHTML = `<i class="fa fa-check-circle"></i> Đã mượn`;
            }
        });
    });

    // Xử lý khi nhấn "Hủy"
    document.querySelectorAll(".btn-danger.btn-xs").forEach(btn => {
        btn.addEventListener("click", e => {
            const row = e.target.closest("tr");
            const nhanDe = row.querySelector("td:nth-child(3) strong")?.textContent.trim() || "";

            if (confirm(`❌ Bạn có chắc muốn hủy đơn mượn sách:\n"${nhanDe}" không?`)) {
                row.querySelector("td:nth-child(7)").innerHTML = `<span class="label label-default">Đã hủy</span>`;
            }
        });
    });

    // Xử lý khi nhấn "In biên nhận"
    document.querySelectorAll(".btn-in-bien-nhan").forEach(btn => {
        btn.addEventListener("click", e => {
            const row = e.target.closest("tr");
            const thanhVien = row.querySelector("td:nth-child(2) strong")?.textContent.trim() || "";
            const nhanDe = row.querySelector("td:nth-child(3) strong")?.textContent.trim() || "";
            const soDKCB = row.querySelector("td:nth-child(4)")?.textContent.trim() || "";

            alert(`🧾 In biên nhận:\nThành viên: ${thanhVien}\nSách: ${nhanDe}\nSố ĐKCB: ${soDKCB}`);
        });
    });
});





////////////////////////////
/// TAB 2: CHÍNH SÁCH /////////
///////////////////////////
document.addEventListener("DOMContentLoaded", () => {

    // ========== 📗 LƯU CHÍNH SÁCH MƯỢN ==========
    window.savePolicy = function () {
        const group = document.getElementById("policyGroup").value;
        const type = document.getElementById("policyType").value;
        const days = document.getElementById("policyDays").value;
        const limit = document.getElementById("policyLimit").value;
        const summary = document.getElementById("policySummary");

        if (!group || !type || !days || !limit) {
            summary.style.display = "block";
            summary.style.background = "#ffecec";
            summary.style.color = "#b71c1c";
            summary.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin trước khi lưu!";
            return;
        }

        const txt = `✅ Chính sách đã lưu cho nhóm [${group}] – Loại tài liệu [${type}]
        • Thời hạn: ${days} ngày
        • Giới hạn mượn: ${limit} tài liệu`;
        summary.style.display = "block";
        summary.style.background = "#f1f6ff";
        summary.style.color = "#004085";
        summary.textContent = txt;
    };


    // ========== 💸 LƯU QUY TẮC PHẠT ==========
    window.saveFineRule = function () {
        const perDay = document.getElementById("finePerDay").value;
        const fineMax = document.getElementById("fineMax").value;
        const discount = document.getElementById("fineDiscountGroup").value;
        const fineSummary = document.getElementById("fineSummary");

        if (!perDay || !fineMax) {
            fineSummary.style.display = "block";
            fineSummary.style.background = "#ffecec";
            fineSummary.style.color = "#b71c1c";
            fineSummary.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin phạt!";
            return;
        }

        let discountText = "Không có nhóm miễn giảm";
        if (discount === "GV") discountText = "Giảng viên (Miễn phạt)";
        else if (discount === "SV") discountText = "Sinh viên (Giảm 50%)";

        fineSummary.style.display = "block";
        fineSummary.style.background = "#f1f6ff";
        fineSummary.style.color = "#004085";
        fineSummary.textContent =
            `✅ Quy tắc phạt đã lưu:
            • ${perDay}đ/ngày – Tối đa ${fineMax}đ
            • ${discountText}`;
    };


    // ========== 🕒 LƯU LỊCH LÀM VIỆC ==========
    window.saveSchedule = function () {
        const open = document.getElementById("openTime").value;
        const close = document.getElementById("closeTime").value;
        const offDays = Array.from(document.getElementById("offDays").selectedOptions).map(o => o.value);
        const summary = document.getElementById("scheduleSummary");

        summary.style.display = "block";
        summary.style.background = "#f1f6ff";
        summary.style.color = "#004085";
        summary.textContent =
            `✅ Lưu thành công lịch làm việc:
            • Giờ mở: ${open} → Giờ đóng: ${close}
            • Nghỉ: ${offDays.join(", ")}`;
    };


    // ========== ⚖️ KIỂM TRA HỢP LỆ ==========
    window.kiemTraHopLe = function () {
        const reader = document.getElementById("checkReader").value;
        const book = document.getElementById("checkBookCode").value.trim();
        const result = document.getElementById("checkResult");

        if (!reader || !book) {
            result.style.display = "block";
            result.style.background = "#ffecec";
            result.style.color = "#b71c1c";
            result.textContent = "⚠️ Cần chọn bạn đọc và nhập mã sách!";
            return;
        }

        // Giả lập kiểm tra hợp lệ
        const isValid = Math.random() > 0.3; // 70% hợp lệ
        result.style.display = "block";
        if (isValid) {
            result.style.background = "#e9fbe9";
            result.style.color = "#1b5e20";
            result.textContent = `✅ Giao dịch hợp lệ! Bạn đọc ${reader} có thể mượn sách ${book}.`;
        } else {
            result.style.background = "#ffecec";
            result.style.color = "#b71c1c";
            result.textContent = `❌ Không hợp lệ! Bạn đọc ${reader} đã vượt quá giới hạn hoặc sách ${book} không khả dụng.`;
        }
    };


    // ========== 📂 XUẤT / NHẬP CẤU HÌNH ==========
    window.exportConfig = function () {
        const config = {
            group: document.getElementById("policyGroup").value,
            type: document.getElementById("policyType").value,
            days: document.getElementById("policyDays").value,
            limit: document.getElementById("policyLimit").value,
            fine: {
                perDay: document.getElementById("finePerDay").value,
                max: document.getElementById("fineMax").value,
                discount: document.getElementById("fineDiscountGroup").value
            },
            schedule: {
                open: document.getElementById("openTime").value,
                close: document.getElementById("closeTime").value,
                offDays: Array.from(document.getElementById("offDays").selectedOptions).map(o => o.value)
            }
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "library_policy_config.json";
        a.click();
        URL.revokeObjectURL(url);

        const summary = document.getElementById("configSummary");
        summary.style.display = "block";
        summary.textContent = "💾 Cấu hình đã được xuất ra file JSON.";
    };


    window.importConfig = function (input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);

                // Gán dữ liệu vào form
                document.getElementById("policyGroup").value = data.group || "";
                document.getElementById("policyType").value = data.type || "";
                document.getElementById("policyDays").value = data.days || "";
                document.getElementById("policyLimit").value = data.limit || "";
                document.getElementById("finePerDay").value = data.fine?.perDay || "";
                document.getElementById("fineMax").value = data.fine?.max || "";
                document.getElementById("fineDiscountGroup").value = data.fine?.discount || "";
                document.getElementById("openTime").value = data.schedule?.open || "08:00";
                document.getElementById("closeTime").value = data.schedule?.close || "17:00";

                // Đặt ngày nghỉ
                const offDaysSelect = document.getElementById("offDays");
                Array.from(offDaysSelect.options).forEach(opt => {
                    opt.selected = data.schedule?.offDays?.includes(opt.value);
                });

                const summary = document.getElementById("configSummary");
                summary.style.display = "block";
                summary.style.background = "#f1f6ff";
                summary.style.color = "#004085";
                summary.textContent = "✅ Đã nhập cấu hình thành công!";
            } catch {
                alert("❌ File cấu hình không hợp lệ!");
            }
        };
        reader.readAsText(file);
    };

});




// ==========================
// 📅 QUẢN LÝ THẺ & LỊCH THƯ VIỆN
// ==========================

// 🔹 Dữ liệu mẫu
const cards = [
    { id: 1, code: "BD001", name: "Nguyễn Văn A", issue: "2024-01-05", expiry: "2025-01-05", status: "Hoạt động" },
    { id: 2, code: "BD002", name: "Trần Thị B", issue: "2023-05-12", expiry: "2024-05-12", status: "Bị khóa" },
    { id: 3, code: "BD003", name: "Lê Văn C", issue: "2023-09-20", expiry: "2025-09-20", status: "Hoạt động" },
    { id: 4, code: "BD004", name: "Phạm Thị D", issue: "2023-03-11", expiry: "2024-03-11", status: "Chờ duyệt" },
    { id: 5, code: "BD005", name: "Đỗ Quang E", issue: "2023-06-10", expiry: "2025-06-10", status: "Hoạt động" },
];

const requests = [
    { id: "YC001", reader: "Nguyễn Văn A", type: "Gia hạn", date: "2025-10-01", status: "Đang chờ" },
    { id: "YC002", reader: "Trần Thị B", type: "Cấp mới", date: "2025-10-02", status: "Đang chờ" },
];

// 🔹 Hàm render bảng thẻ
function renderCards(list = cards) {
    const tbody = document.getElementById("cardBody");
    tbody.innerHTML = "";
    list.forEach((card, index) => {
        const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${card.code}</td>
        <td>${card.name}</td>
        <td>${formatDate(card.issue)}</td>
        <td>${formatDate(card.expiry)}</td>
        <td>
          <span class="label ${getStatusClass(card.status)}">${card.status}</span>
        </td>
        <td>
          <button class="btn btn-xs btn-warning" onclick="toggleLock('${card.code}')">
            ${card.status === "Bị khóa" ? "🔓 Mở khóa" : "🔒 Khóa"}
          </button>
        </td>
      </tr>
    `;
        tbody.insertAdjacentHTML("beforeend", row);
    });
    updateStats();
}

// 🔹 Hàm render bảng yêu cầu
function renderRequests() {
    const tbody = document.getElementById("requestBody");
    tbody.innerHTML = "";
    requests.forEach(req => {
        const row = `
      <tr>
        <td>${req.id}</td>
        <td>${req.reader}</td>
        <td>${req.type}</td>
        <td>${formatDate(req.date)}</td>
        <td><span class="label label-info">${req.status}</span></td>
        <td>
          <button class="btn btn-success btn-xs" onclick="approveRequest('${req.id}')">✅ Duyệt</button>
          <button class="btn btn-danger btn-xs" onclick="rejectRequest('${req.id}')">❌ Từ chối</button>
        </td>
      </tr>
    `;
        tbody.insertAdjacentHTML("beforeend", row);
    });
}

// 🔹 Lọc thẻ theo tên hoặc mã
function filterCards() {
    const keyword = document.getElementById("searchCard").value.toLowerCase();
    const filtered = cards.filter(card =>
        card.name.toLowerCase().includes(keyword) || card.code.toLowerCase().includes(keyword)
    );
    renderCards(filtered);
}

// 🔹 Khóa / mở khóa thẻ
function toggleLock(code) {
    const card = cards.find(c => c.code === code);
    if (card) {
        card.status = card.status === "Bị khóa" ? "Hoạt động" : "Bị khóa";
        renderCards();
    }
}

// 🔹 Duyệt yêu cầu
function approveRequest(id) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = "Đã duyệt";
        alert(`✅ Yêu cầu ${req.id} đã được duyệt!`);
        renderRequests();
    }
}

// 🔹 Từ chối yêu cầu
function rejectRequest(id) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = "Từ chối";
        alert(`❌ Yêu cầu ${req.id} đã bị từ chối.`);
        renderRequests();
    }
}

// 🔹 Ẩn / hiện lịch thư viện
function toggleSchedule() {
    const box = document.getElementById("librarySchedule");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

// 🔹 Cập nhật thống kê
function updateStats() {
    const active = cards.filter(c => c.status === "Hoạt động").length;
    const locked = cards.filter(c => c.status === "Bị khóa").length;
    const pending = cards.filter(c => c.status === "Chờ duyệt").length;
    const expirySoon = cards.reduce((a, b) =>
        new Date(a.expiry) < new Date(b.expiry) ? a : b
    );

    document.getElementById("stat-active").textContent = active;
    document.getElementById("stat-locked").textContent = locked;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-expiry").textContent = formatDate(expirySoon.expiry);
}

// 🔹 Tiện ích định dạng ngày
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}

// 🔹 Lấy class màu trạng thái
function getStatusClass(status) {
    switch (status) {
        case "Hoạt động": return "label-success";
        case "Bị khóa": return "label-danger";
        case "Chờ duyệt": return "label-warning";
        default: return "label-default";
    }
}

// 🔹 Khởi động khi trang load
document.addEventListener("DOMContentLoaded", () => {
    renderCards();
    renderRequests();
});




//========================PHÂN TRANG ================////

document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = 5; // mỗi trang hiển thị 5 dòng
    const tableBody = document.querySelector("#tab-dangky tbody");
    const pagination = document.querySelector(".pagination");

    if (!tableBody || !pagination) return;

    const rows = Array.from(tableBody.querySelectorAll("tr"));
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1;

    // 🧩 Hàm hiển thị từng trang
    function renderPage(page) {
        // Ẩn tất cả các dòng
        rows.forEach(row => (row.style.display = "none"));

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        rows.slice(start, end).forEach(row => (row.style.display = ""));

        renderPagination();
    }

    // 🧩 Vẽ thanh phân trang
    function renderPagination() {
        pagination.innerHTML = "";

        // Nút « Trước
        const prev = document.createElement("li");
        prev.className = currentPage === 1 ? "disabled" : "";
        prev.innerHTML = `<a href="#">&laquo;</a>`;
        prev.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        };
        pagination.appendChild(prev);

        // Số trang
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = i === currentPage ? "active" : "";
            li.innerHTML = `<a href="#">${i}</a>`;
            li.onclick = () => {
                currentPage = i;
                renderPage(currentPage);
            };
            pagination.appendChild(li);
        }

        // Nút » Tiếp
        const next = document.createElement("li");
        next.className = currentPage === totalPages ? "disabled" : "";
        next.innerHTML = `<a href="#">&raquo;</a>`;
        next.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        };
        pagination.appendChild(next);
    }

    // Khởi tạo
    renderPage(1);
});



//===========ĐANG MƯỢN ==============//
document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("#tab-dangmuon table");

    // Gắn sự kiện cho tất cả nút "Gia hạn"
    table.addEventListener("click", function (e) {
        if (e.target.closest(".btn-giahan")) {
            const row = e.target.closest("tr");
            const member = row.children[1].textContent.trim();
            const title = row.children[2].textContent.trim();

            // Hiển thị xác nhận
            if (confirm(`Gia hạn thêm 7 ngày cho "${title}" của ${member}?`)) {
                const hanTra = row.children[4];
                const currentDate = new Date(hanTra.textContent.trim().split("/").reverse().join("-"));
                currentDate.setDate(currentDate.getDate() + 7);
                const newDate = currentDate.toLocaleDateString("vi-VN");

                hanTra.textContent = newDate;
                alert(`✅ Gia hạn thành công đến ngày ${newDate}!`);
            }
        }
    });
});


//===================ĐÃ TRẢ ========================//
document.addEventListener("DOMContentLoaded", function () {
    const tableDaTra = document.querySelector("#tab-datra table");
    let currentBook = "";

    // Khi nhấn nút "Đánh giá"
    tableDaTra.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-rate");
        if (!btn) return;

        const row = btn.closest("tr");
        currentBook = row.children[2].textContent.trim();

        document.getElementById("bookName").value = currentBook;
        $("#modalDanhGia").modal("show");
    });

    // Khi nhấn "Lưu đánh giá"
    document.getElementById("btnLuuDanhGia").addEventListener("click", function () {
        const score = document.getElementById("ratingScore").value;
        const comment = document.getElementById("ratingComment").value.trim();

        if (comment === "") {
            alert("Vui lòng nhập nhận xét trước khi lưu!");
            return;
        }

        // Hiển thị kết quả tạm (sau này bạn có thể gửi API)
        $("#modalDanhGia").modal("hide");
        alert(`✅ Đánh giá đã lưu!\n📘 Sách: ${currentBook}\n⭐ Điểm: ${score}/5\n💬 Nhận xét: ${comment}`);

        // Reset form
        document.getElementById("formDanhGia").reset();
    });
});



//====================== QUÁ HẠN ====================//
document.addEventListener("DOMContentLoaded", function () {
    const tableQuaHan = document.querySelector("#tab-quahan table");
    const modal = $("#modalLienHe");

    tableQuaHan.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-danger");
        if (!btn) return;

        const row = btn.closest("tr");
        const member = row.children[1].textContent.trim();
        const book = row.children[2].textContent.trim();

        document.getElementById("lhTenThanhVien").value = member;
        document.getElementById("lhTenSach").value = book;
        document.getElementById("lhNoiDung").value =
            `Xin chào ${member},\n\nHệ thống thư viện thông báo sách "${book}" của bạn đã quá hạn. ` +
            `Vui lòng đến trả hoặc gia hạn mượn sớm nhất có thể.\n\nTrân trọng.`;

        modal.modal("show");
    });

    document.getElementById("btnGuiLienHe").addEventListener("click", function () {
        const member = document.getElementById("lhTenThanhVien").value;
        const book = document.getElementById("lhTenSach").value;
        modal.modal("hide");
        alert(`✅ Đã gửi nhắc nhở tới ${member}\n📚 Sách: ${book}`);
    });
});

