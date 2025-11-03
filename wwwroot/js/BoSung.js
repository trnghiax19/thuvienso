/* ===========================================================
   🧾 TAB 1: Đơn đặt mua / Hợp đồng 
   =========================================================== */
$(document).ready(function () {
    const contracts = [
        {
            code: "HD-2025-001",
            supplier: "Cty ABC",
            product: "Sách JS nâng cao",
            quantity: 10,
            orderDate: "2025-10-20",
            expiryDate: "2025-12-31",
            status: "active",  // active / expired / cancelled
            note: ""
        },
        {
            code: "HD-2025-002",
            supplier: "Cty XYZ",
            product: "Sách Python cơ bản",
            quantity: 5,
            orderDate: "2025-06-01",
            expiryDate: "2025-09-30",
            status: "expired",
            note: ""
        },
        {
            code: "HD-2025-003",
            supplier: "Cty DEF",
            product: "Tạp chí CNTT",
            quantity: 3,
            orderDate: "2025-05-10",
            expiryDate: "2025-08-01",
            status: "cancelled",
            note: "Lý do: Hết nhu cầu"
        }
    ];

    // ===== Render bảng =====
    const tbody = document.getElementById("contractTableBody");

    function getStatusBadge(status) {
        if (status === "active") return '<span class="status-badge badge-processing">Còn hiệu lực</span>';
        if (status === "expired") return '<span class="status-badge badge-pending">Hết hạn</span>';
        if (status === "cancelled") return '<span class="status-badge badge-complete">Đã huỷ</span>';
        return "";
    }

    function renderTable(data) {
        tbody.innerHTML = "";
        data.forEach(item => {
            tbody.innerHTML += `
            <tr data-status="${item.status}">
                <td>${item.code}</td>
                <td>${item.supplier}</td>
                <td>${item.product}</td>
                <td>${item.quantity}</td>
                <td>${item.orderDate}</td>
                <td>${item.expiryDate}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td class="wrap-text" title="${item.note}">${item.note}</td>
                <td></td>
            </tr>
        `;
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    // ===== Search =====
    document.getElementById("searchInput").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const filtered = contracts.filter(c =>
            c.code.toLowerCase().includes(query) ||
            c.supplier.toLowerCase().includes(query) ||
            c.product.toLowerCase().includes(query)
        );
        renderTable(filtered);
    });

    // ===== Initial render =====
    renderTable(contracts);
    // Lập mới
    $("#showCreateModal").click(function () {
        $("#createModal").modal("show");
        $("#createModal input").val("");
    });

    $("#createBtnModal").click(function () {
        let supplier = $("#newSupplier").val().trim();
        let product = $("#newProduct").val().trim();
        let qty = $("#newQty").val().trim();
        let date = $("#newDate").val();
        if (!supplier || !product || !qty || !date) { alert("Vui lòng nhập đầy đủ thông tin!"); return; }

        let code = "HD-" + new Date().getFullYear() + "-" + Math.floor(100 + Math.random() * 900);
        let expireDate = new Date(date); expireDate.setMonth(expireDate.getMonth() + 3);
        let row = `<tr data-status="active">
          <td>${code}</td>
          <td class="wrap-text">${supplier}</td>
          <td class="wrap-text">${product}</td>
          <td>${qty}</td>
          <td>${date}</td>
          <td>${expireDate.toISOString().slice(0, 10)}</td>
          <td><span class="status-badge badge-processing">Còn hiệu lực</span></td>
          <td class="wrap-text"></td>
          <td></td>
        </tr>`;
        $("#contractTableBody").append(row);
        renderActions($("#contractTableBody tr").last());
        $("#createModal").modal("hide");
        setupPagination();
    });

    // Sửa hợp đồng
    $(document).on("click", ".btn-edit", function () {
        let row = $(this).closest("tr");
        $("#editModal").data("row", row).modal("show");
        $("#editProduct").val(row.find("td:eq(2)").text());
        $("#editQty").val(row.find("td:eq(3)").text());
        $("#editNote").val(row.find("td:eq(7)").text());
    });

    $("#confirmEdit").click(function () {
        let row = $("#editModal").data("row");
        let product = $("#editProduct").val().trim();
        let qty = $("#editQty").val().trim();
        if (!product || !qty) { alert("Nhập đầy đủ thông tin"); return; }
        row.find("td:eq(2)").text(product);
        row.find("td:eq(3)").text(qty);
        row.find("td:eq(7)").text(note);
        $("#editModal").modal("hide");
    });

    // Gia hạn
    $(document).on("click", ".btn-extend", function () {
        $("#extendModal").data("row", $(this).closest("tr")).modal("show");
        $("#extendNumber").val(""); $("#extendType").val("month");
    });

    $("#confirmExtend").click(function () {
        let num = parseInt($("#extendNumber").val());
        let type = $("#extendType").val();
        if (!num) { alert("Vui lòng nhập số lượng!"); return; }
        let row = $("#extendModal").data("row");
        let currentDate = new Date(row.find("td:eq(5)").text());
        if (type == "month") currentDate.setMonth(currentDate.getMonth() + num);
        else if (type == "quarter") currentDate.setMonth(currentDate.getMonth() + 3 * num);
        else if (type == "year") currentDate.setFullYear(currentDate.getFullYear() + num);
        row.find("td:eq(5)").text(currentDate.toISOString().slice(0, 10));
        row.attr("data-status", "active");
        row.find(".status-badge").removeClass("badge-pending").addClass("badge-processing").text("Còn hiệu lực");
        renderActions(row);
        $("#extendModal").modal("hide");
    });

    // Huỷ
    $(document).on("click", ".btn-cancel", function () {
        $("#cancelModal").data("row", $(this).closest("tr")).modal("show");
        $("#cancelReason").val("");
    });

    $("#confirmCancel").click(function () {
        let reason = $("#cancelReason").val().trim();
        if (!reason) { alert("Nhập lý do huỷ!"); return; }
        let row = $("#cancelModal").data("row");
        row.attr("data-status", "cancelled");
        row.find(".status-badge").removeClass("badge-processing").addClass("badge-complete").text("Đã huỷ").attr("title", "Lý do: " + reason);
        row.find("td:eq(7)").text(reason);
        renderActions(row);
        $("#cancelModal").modal("hide");
    });

    // Tìm kiếm
    $("#searchInput").on("input", function () {
        let val = $(this).val().toLowerCase();
        $("#contractTableBody tr").each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
        setupPagination();
    });

    // Phân trang
    function setupPagination() {
        let rows = $("#contractTableBody tr:visible");
        let perPage = 5;
        let totalPages = Math.ceil(rows.length / perPage);
        $("#pagination").html("");
        for (let i = 1; i <= totalPages; i++) {
            $("#pagination").append(`<li><a href="#">${i}</a></li>`);
        }
        rows.hide();
        rows.slice(0, perPage).show();
        $("#pagination li:first").addClass("active");
        $("#pagination li a").click(function (e) {
            e.preventDefault();
            let idx = parseInt($(this).text()) - 1;
            $("#pagination li").removeClass("active"); $(this).parent().addClass("active");
            rows.hide(); rows.slice(idx * perPage, (idx + 1) * perPage).show();
        });
    }

    setupPagination();

    // Render action
    function renderActions(row) {
        let status = row.attr("data-status");
        let startDate = new Date(row.find("td:eq(4)").text());
        let today = new Date();
        let actions = "";

        if (status === "active") {
            if (startDate > today) actions += '<button class="btn btn-warning btn-xs btn-edit"> <i class="fa-solid fa-pen-to-square"></i></button> ';
            actions += '<button class="btn btn-info btn-xs btn-extend"><i class="fa-solid fa-rotate-right"></i></button> ';
            actions += '<button class="btn btn-danger btn-xs btn-cancel"><i class="fa-solid fa-xmark"></i></button>';
        } else if (status === "expired") {
            actions += '<button class="btn btn-info btn-xs btn-extend"><i class="fa-solid fa-rotate-right"></i></button>';
        } else if (status === "cancelled") {
            actions = "";
        }

        row.find("td:last").html(actions);
    }

    $("#contractTableBody tr").each(function () { renderActions($(this)); });

});
$(document).ready(function () {

    // Dữ liệu mẫu chi phí
    let costData = [
        { code: "HD-2025-001", date: "2025-10-21", type: "Dự kiến", planned: 1500000, actual: 0, note: "Đặt thêm 10 cuốn" },
        { code: "HD-2025-002", date: "2025-06-05", type: "Thực tế", planned: 500000, actual: 500000, note: "Đặt theo hợp đồng" },
        { code: "HD-2025-003", date: "2025-05-12", type: "Dự kiến", planned: 300000, actual: 0, note: "" }
    ];

    let detailPerPage = 5;    // Phân trang chi tiết
    let summaryPerPage = 5;   // Phân trang tổng hợp

    // -------------------------------
    // Render bảng chi tiết
    function renderCostTable(filteredData = costData) {
        let tbody = $("#costTableBody");
        tbody.empty();

        filteredData.forEach((item) => {
            let row = `<tr>
                <td>${item.code}</td>
                <td>${item.date}</td>
                <td>${item.type}</td>
                <td>${item.planned}</td>
                <td>${item.actual}</td>
                <td>${item.note}</td>
            </tr>`;
            tbody.append(row);
        });

        setupCostPagination(filteredData);
        renderSummaryTable();
    }

    // -------------------------------
    // Phân trang bảng chi tiết
    function setupCostPagination(data) {
        let rows = $("#costTableBody tr");
        let totalPages = Math.ceil(data.length / detailPerPage);
        $("#costPagination").html("");

        for (let i = 1; i <= totalPages; i++) {
            $("#costPagination").append(`<li><a href="#">${i}</a></li>`);
        }

        rows.hide();
        rows.slice(0, detailPerPage).show();
        $("#costPagination li:first").addClass("active");

        $("#costPagination li a").click(function (e) {
            e.preventDefault();
            let idx = parseInt($(this).text()) - 1;
            $("#costPagination li").removeClass("active");
            $(this).parent().addClass("active");
            rows.hide();
            rows.slice(idx * detailPerPage, (idx + 1) * detailPerPage).show();
        });
    }

    // -------------------------------
    // Tìm kiếm bảng chi tiết theo mã hợp đồng
    $("#searchCostInput").on("input", function () {
        let val = $(this).val().toLowerCase();
        let filteredData = costData.filter(item => item.code.toLowerCase().includes(val));
        renderCostTable(filteredData);
    });

    // -------------------------------
    // Hiển thị modal thêm chi phí
    $("#showAddCostModal").click(function () {
        $("#addCostModal").modal("show");
        $("#addCostModal input, #addCostModal select").val("");
    });

    // Thêm chi phí mới
    function addNewCost() {
        let code = $("#costContractCode").val().trim();
        let date = $("#costDate").val();
        let type = $("#costType").val();
        let planned = $("#costPlanned").val().trim();
        let actual = $("#costActual").val().trim();
        let note = $("#costNote").val().trim();
        if (!code || !date || !type || !planned) { alert("Vui lòng nhập đầy đủ thông tin!"); return; }

        costData.push({ code, date, type, planned: Number(planned), actual: Number(actual) || 0, note });
        renderCostTable();
        $("#addCostModal").modal("hide");
    }

    $("#createCostBtn").off("click").click(addNewCost);

    // Sửa chi phí (nếu muốn giữ modal sửa, để lại code cũ)
    $(document).on("click", ".btn-edit-cost", function () {
        let row = $(this).closest("tr");
        let index = row.index();
        let item = costData[index];

        $("#costContractCode").val(item.code);
        $("#costDate").val(item.date);
        $("#costType").val(item.type);
        $("#costPlanned").val(item.planned);
        $("#costActual").val(item.actual);
        $("#costNote").val(item.note);

        $("#addCostModal").modal("show");

        $("#createCostBtn").off("click").click(function () {
            let code = $("#costContractCode").val().trim();
            let date = $("#costDate").val();
            let type = $("#costType").val();
            let planned = $("#costPlanned").val().trim();
            let actual = $("#costActual").val().trim();
            let note = $("#costNote").val().trim();
            if (!code || !date || !type || !planned) { alert("Vui lòng nhập đầy đủ thông tin!"); return; }

            costData[index] = { code, date, type, planned: Number(planned), actual: Number(actual) || 0, note };
            renderCostTable();
            $("#addCostModal").modal("hide");

            $("#createCostBtn").off("click").click(addNewCost);
        });
    });

    // -------------------------------
    // Bảng tổng hợp + tìm kiếm + phân trang
    function renderSummaryTable(filteredSummary = null) {
        let summary = {};
        costData.forEach(item => {
            if (!summary[item.code]) summary[item.code] = { planned: 0, actual: 0, count: 0 };
            summary[item.code].planned += Number(item.planned);
            summary[item.code].actual += Number(item.actual);
            summary[item.code].count += 1;
        });

        if (filteredSummary) summary = filteredSummary;

        let tbody = $("#summaryTableBody");
        tbody.empty();
        for (let code in summary) {
            let row = `<tr>
                <td>${code}</td>
                <td>${summary[code].planned}</td>
                <td>${summary[code].actual}</td>
                <td>${summary[code].actual - summary[code].planned}</td>
                <td>${summary[code].count}</td>
            </tr>`;
            tbody.append(row);
        }

        setupSummaryPagination(Object.keys(summary));
        renderCostChart(summary);
    }

    function setupSummaryPagination(labels) {
        let totalRows = labels.length;
        let totalPages = Math.ceil(totalRows / summaryPerPage);
        $("#summaryPagination").html("");

        for (let i = 1; i <= totalPages; i++) {
            $("#summaryPagination").append(`<li><a href="#">${i}</a></li>`);
        }

        $("#summaryPagination li:first").addClass("active");
        $("#summaryTableBody tr").hide();
        $("#summaryTableBody tr").slice(0, summaryPerPage).show();

        $("#summaryPagination li a").click(function (e) {
            e.preventDefault();
            let idx = parseInt($(this).text()) - 1;
            $("#summaryPagination li").removeClass("active");
            $(this).parent().addClass("active");
            $("#summaryTableBody tr").hide();
            $("#summaryTableBody tr").slice(idx * summaryPerPage, (idx + 1) * summaryPerPage).show();
        });
    }

    // Tìm kiếm bảng tổng hợp theo mã hợp đồng
    $("#searchSummaryInput").on("input", function () {
        let val = $(this).val().toLowerCase();
        let filteredSummary = {};
        costData.forEach(item => {
            if (item.code.toLowerCase().includes(val)) {
                if (!filteredSummary[item.code]) filteredSummary[item.code] = { planned: 0, actual: 0, count: 0 };
                filteredSummary[item.code].planned += Number(item.planned);
                filteredSummary[item.code].actual += Number(item.actual);
                filteredSummary[item.code].count += 1;
            }
        });
        renderSummaryTable(filteredSummary);
    });

    // -------------------------------
    // Biểu đồ chi phí
    function renderCostChart(summary) {
        let labels = Object.keys(summary);
        let planned = labels.map(code => summary[code].planned);
        let actual = labels.map(code => summary[code].actual);

        let ctx = document.getElementById('costChart').getContext('2d');
        if (window.costChartInstance) window.costChartInstance.destroy();

        window.costChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Dự kiến', data: planned, backgroundColor: '#36A2EB' },
                    { label: 'Thực tế', data: actual, backgroundColor: '#FF6384' }
                ]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    // -------------------------------
    // ===================== KHỞI TẠO =====================
    renderCostTable();

    let perPageReconcile = 5;
    let today = new Date();

    let reconcileData = [
        { code: "HD-2025-001", product: "Sách JS nâng cao", expectedDate: "2025-10-15", receivedDate: "2025-10-19", ordered: 10, received: 8, note: "Thiếu 2 cuốn", complaintStatus: "none" },
        { code: "HD-2025-002", product: "Sách Python cơ bản", expectedDate: "2025-10-10", receivedDate: "2025-10-09", ordered: 5, received: 5, note: "", complaintStatus: "none" },
        { code: "HD-2025-003", product: "Tạp chí CNTT", expectedDate: "2025-10-17", receivedDate: "", ordered: 3, received: 0, note: "", complaintStatus: "none" }
    ];

    // ============================
    // HÀM HIỂN THỊ BẢNG
    // ============================
    function renderReconcileTable(filteredData = reconcileData) {
        let tbody = $("#reconcileTableBody");
        tbody.empty();

        filteredData.forEach((item) => {
            let expected = new Date(item.expectedDate);
            let received = item.receivedDate ? new Date(item.receivedDate) : null;
            let isLate = !received || received > expected;
            let diff = item.received - item.ordered;

            // Tính màu chênh lệch
            let diffColor = diff < 0 ? "color:red;" : diff > 0 ? "color:orange;" : "color:green;";

            // Trạng thái khiếu nại
            let statusLabel = "";
            if (item.complaintStatus === "sent") {
                statusLabel = '<span class="label label-warning">Đã gửi khiếu nại</span>';
            } else if (isLate) {
                statusLabel = '<span class="label label-danger">Quá hạn nhận</span>';
            } else {
                statusLabel = '<span class="label label-success">Bình thường</span>';
            }

            // Nút hành động
            let actionBtn = "";
            if (isLate && item.complaintStatus === "none") {
                actionBtn = `<button class="btn btn-danger btn-xs btn-complaint">Khiếu nại</button>`;
            }

            let row = `
        <tr>
            <td>${item.code}</td>
            <td>${item.product}</td>
            <td>${item.expectedDate}</td>
            <td>${item.receivedDate || "Chưa nhận"}</td>
            <td>${item.ordered}</td>
            <td style="${diffColor}">${item.received}</td>
            <td>${item.note}</td>
            <td>${statusLabel}</td>
            <td>${actionBtn}</td>
        </tr>`;
            tbody.append(row);
        });

        setupReconcilePagination(filteredData);
    }

    // ============================
    // PHÂN TRANG
    // ============================
    function setupReconcilePagination(data) {
        let rows = $("#reconcileTableBody tr");
        let totalPages = Math.ceil(data.length / perPageReconcile);
        $("#reconcilePagination").html("");

        for (let i = 1; i <= totalPages; i++) {
            $("#reconcilePagination").append(`<li><a href="#">${i}</a></li>`);
        }

        rows.hide();
        rows.slice(0, perPageReconcile).show();
        $("#reconcilePagination li:first").addClass("active");

        $("#reconcilePagination li a").click(function (e) {
            e.preventDefault();
            let idx = parseInt($(this).text()) - 1;
            $("#reconcilePagination li").removeClass("active");
            $(this).parent().addClass("active");
            rows.hide();
            rows.slice(idx * perPageReconcile, (idx + 1) * perPageReconcile).show();
        });
    }

    // ============================
    // MỞ MODAL KHIẾU NẠI
    // ============================
    $(document).on("click", ".btn-complaint", function () {
        let row = $(this).closest("tr");
        let index = row.index();
        let item = reconcileData[index];

        $("#complaintModal").data("rowIndex", index);
        $("#complaintReason").val(`Đơn hàng ${item.code} bị quá hạn nhận (${item.expectedDate})`);
        $("#complaintNote").val("");
        $("#complaintModal").modal("show");
    });

    // ============================
    // XỬ LÝ GỬI KHIẾU NẠI
    // ============================
    $("#confirmComplaint").click(function () {
        let index = $("#complaintModal").data("rowIndex");
        let reason = $("#complaintReason").val().trim();
        let note = $("#complaintNote").val().trim();

        if (!reason) {
            alert("Vui lòng nhập lý do khiếu nại!");
            return;
        }

        reconcileData[index].note = reason + (note ? " | " + note : "");
        reconcileData[index].complaintStatus = "sent";

        renderReconcileTable();
        $("#complaintModal").modal("hide");
    });

    // ============================
    // TÌM KIẾM MÃ HỢP ĐỒNG
    // ============================
    $("#searchReconcileInput").on("input", function () {
        let val = $(this).val().toLowerCase();
        let filteredData = reconcileData.filter(item => item.code.toLowerCase().includes(val));
        renderReconcileTable(filteredData);
    });


    renderReconcileTable();

    // ====================== NHÀ CUNG CẤP ======================
    let suppliers = [
        { code: "NCC001", name: "Công ty Sách ABC", address: "123 Lê Lợi, Q1, TP.HCM", phone: "0909123456", email: "abc@books.vn", note: "Đối tác chính" },
        { code: "NCC002", name: "NXB Giáo dục", address: "25 Hai Bà Trưng, Hà Nội", phone: "0241234567", email: "contact@nxb.vn", note: "" },
    ];

    let perPageSupplier = 5;

    function renderSupplierTable(filtered = suppliers) {
        let tbody = $("#supplierTableBody");
        tbody.empty();

        filtered.forEach((s, index) => {
            tbody.append(`
            <tr>
                <td>${s.code}</td>
                <td>${s.name}</td>
                <td>${s.address}</td>
                <td>${s.phone}</td>
                <td>${s.email}</td>
                <td>${s.note}</td>
                <td>
                    <button class="btn btn-warning btn-xs btn-edit-supplier" data-index="${index}">
                        <span class="glyphicon glyphicon-pencil"></span>
                    </button>
                    <button class="btn btn-danger btn-xs btn-delete-supplier" data-index="${index}">
                        <span class="glyphicon glyphicon-trash"></span>
                    </button>
                </td>
            </tr>
        `);
        });
       
        setupSupplierPagination(filtered);
    }

    function setupSupplierPagination(data) {
        let rows = $("#supplierTableBody tr");
        let totalPages = Math.ceil(data.length / perPageSupplier);
        let pagination = $("#supplierPagination");
        pagination.empty();

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`<li><a href="#">${i}</a></li>`);
        }

        rows.hide();
        rows.slice(0, perPageSupplier).show();
        pagination.find("li:first").addClass("active");

        pagination.find("li a").click(function (e) {
            e.preventDefault();
            let idx = $(this).text() - 1;
            pagination.find("li").removeClass("active");
            $(this).parent().addClass("active");
            rows.hide();
            rows.slice(idx * perPageSupplier, (idx + 1) * perPageSupplier).show();
        });
    }

    // Tìm kiếm
    $("#searchSupplier").on("input", function () {
        let val = $(this).val().toLowerCase();
        let filtered = suppliers.filter(s =>
            s.name.toLowerCase().includes(val) || s.code.toLowerCase().includes(val)
        );
        renderSupplierTable(filtered);
    });

    // Thêm mới
    $("#btnAddSupplier").click(function () {
        $("#supplierModalTitle").text("Thêm Nhà cung cấp");
        $("#supplierModal input").val("");
        $("#supplierModal").data("editIndex", null);
        $("#supplierModal").modal("show");
    });

    // Lưu thêm/sửa
    $("#saveSupplierBtn").click(function () {
        let code = $("#supplierCode").val().trim();
        let name = $("#supplierName").val().trim();
        if (!code || !name) { alert("Vui lòng nhập Mã và Tên nhà cung cấp!"); return; }

        let supplier = {
            code,
            name,
            address: $("#supplierAddress").val(),
            phone: $("#supplierPhone").val(),
            email: $("#supplierEmail").val(),
            note: $("#supplierNote").val(),
        };

        let editIndex = $("#supplierModal").data("editIndex");
        if (editIndex != null) suppliers[editIndex] = supplier;
        else suppliers.push(supplier);

        $("#supplierModal").modal("hide");
        renderSupplierTable();
    });

    // Sửa
    $(document).on("click", ".btn-edit-supplier", function () {
        let idx = $(this).data("index");
        let s = suppliers[idx];
        $("#supplierModalTitle").text("Sửa Nhà cung cấp");
        $("#supplierCode").val(s.code);
        $("#supplierName").val(s.name);
        $("#supplierAddress").val(s.address);
        $("#supplierPhone").val(s.phone);
        $("#supplierEmail").val(s.email);
        $("#supplierNote").val(s.note);
        $("#supplierModal").data("editIndex", idx);
        $("#supplierModal").modal("show");
    });

    // Xoá
    $(document).on("click", ".btn-delete-supplier", function () {
        if (!confirm("Bạn có chắc muốn xoá nhà cung cấp này?")) return;
        suppliers.splice($(this).data("index"), 1);
        renderSupplierTable();
    });

    // Khởi tạo
    renderSupplierTable();




});

/* ===========================================================
   🧾 TAB 2 - 3: QUẢN LÝ QUỸ BỔ SUNG - Bổ sung tác nghiệp
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {

    // --------------------------
    // 1️⃣ DỮ LIỆU MẪU BAN ĐẦU
    // --------------------------
    let funds = [
        { code: "F001", name: "Quỹ Mua Sách 2025", type: "Trực tiếp", balance: 50000000, date: "2025-01-10", note: "Quỹ mua sách năm 2025" },
        { code: "F002", name: "Quỹ Tài trợ ABC", type: "Gián tiếp", balance: 30000000, date: "2025-02-05", note: "Tài trợ từ tổ chức ABC" },
        { code: "F003", name: "Quỹ Bổ sung giáo trình", type: "Trực tiếp", balance: 20000000, date: "2025-03-15", note: "Bổ sung tài liệu học tập" }
    ];

    let transactions = [
        { code: "T001", fund: "Quỹ Mua Sách 2025", date: "2025-03-01", type: "Thu", amount: 10000000, note: "Tài trợ thêm" },
        { code: "T002", fund: "Quỹ Mua Sách 2025", date: "2025-03-20", type: "Chi", amount: 7000000, note: "Mua sách đợt 1" },
        { code: "T003", fund: "Quỹ Tài trợ ABC", date: "2025-04-05", type: "Chi", amount: 5000000, note: "Chi phí hội thảo" }
    ];

    let shares = [
        { source: "Quỹ Mua Sách 2025", target: "Quỹ Bổ sung giáo trình", percent: 10, date: "2025-05-01", note: "Chia hỗ trợ tài liệu" },
        { source: "Quỹ Tài trợ ABC", target: "Quỹ Mua Sách 2025", percent: 5, date: "2025-06-10", note: "Bổ sung tài trợ" }
    ];



    // --------------------------
    // 2️⃣ HIỂN THỊ DANH SÁCH QUỸ
    // --------------------------
    const fundTableBody = document.getElementById("fundTableBody");
    function renderFunds() {
        if (!fundTableBody) return;
        fundTableBody.innerHTML = "";
        funds.forEach((f, i) => {
            fundTableBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${f.code}</td>
                    <td>${f.name}</td>
                    <td>${f.type}</td>
                    <td>${f.balance.toLocaleString()} ₫</td>
                    <td>${f.date}</td>
                    <td>${f.note}</td>
                    <td><button class="btn btn-danger btn-xs" onclick="deleteFund('${f.code}')"><span class="glyphicon glyphicon-trash"></span></button></td>
                </tr>`;
        });
    }
    renderFunds();

    window.deleteFund = function (code) {
        funds = funds.filter(f => f.code !== code);
        renderFunds();     // render lại bảng
        renderReport();    // cập nhật biểu đồ
    };


    // --------------------------
    // 3️⃣ THÊM QUỸ MỚI
    // --------------------------
    const fundForm = document.getElementById("addFundForm");
    if (fundForm) {
        fundForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = fundName.value.trim();
            if (!name) return;

            const newFund = {
                code: "F" + (funds.length + 1).toString().padStart(3, "0"),
                name,
                type: fundType.value,
                balance: Number(fundAmount.value),
                date: fundDate.value || new Date().toISOString().split("T")[0],
                note: fundNote.value
            };
            funds.push(newFund);
            renderFunds();
            $("#addFundModal").modal("hide");
            this.reset();
        });
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const code = this.getAttribute("data-code");
            funds = funds.filter(f => f.code !== code);
            renderFunds();
            renderReport();
        });
    });

    // --------------------------
    // 4️⃣ BÁO CÁO CÂN ĐỐI THU/CHI
    // --------------------------
    function renderReport() {
        const tbody = document.getElementById("balanceTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        let reportData = funds.map(f => {
            let totalThu = transactions.filter(t => t.fund === f.name && t.type === "Thu")
                .reduce((sum, t) => sum + t.amount, 0);
            let totalChi = transactions.filter(t => t.fund === f.name && t.type === "Chi")
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                name: f.name,
                thu: totalThu,
                chi: totalChi,
                balance: totalThu - totalChi
            };
        });

        reportData.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.name}</td>
                    <td>${r.thu.toLocaleString()} ₫</td>
                    <td>${r.chi.toLocaleString()} ₫</td>
                    <td>${r.balance.toLocaleString()} ₫</td>
                </tr>`;
        });

        const ctx = document.getElementById("fundBalanceChart");
        if (ctx) {
            if (window.fundChart) window.fundChart.destroy();
            window.fundChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: reportData.map(r => r.name),
                    datasets: [
                        { label: "Thu", data: reportData.map(r => r.thu), backgroundColor: "rgba(75, 192, 192, 0.6)" },
                        { label: "Chi", data: reportData.map(r => r.chi), backgroundColor: "rgba(255, 99, 132, 0.6)" }
                    ]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
        }
    }
    renderReport();
    const btnFilterReport = document.getElementById("btnFilterReport");
    if (btnFilterReport) btnFilterReport.addEventListener("click", renderReport);

    // --------------------------
    // 5️⃣ CHIA SẺ CHI PHÍ
    // --------------------------
    const shareTableBody = document.getElementById("shareTableBody");
    function renderShares() {
        if (!shareTableBody) return;
        shareTableBody.innerHTML = "";
        shares.forEach(s => {
            shareTableBody.innerHTML += `
                <tr>
                    <td>${s.source}</td>
                    <td>${s.target}</td>
                    <td>${s.percent}%</td>
                    <td>${s.date}</td>
                    <td>${s.note}</td>
                </tr>`;
        });
    }
    renderShares();

    const shareForm = document.getElementById("shareForm");
    if (shareForm) {
        shareForm.addEventListener("submit", e => {
            e.preventDefault();
            const newShare = {
                source: fundSource.value,
                target: fundTarget.value,
                percent: Number(sharePercent.value),
                date: new Date().toISOString().split("T")[0],
                note: "Chia tự động"
            };
            shares.push(newShare);
            renderShares();
            shareForm.reset();
        });
    }

    // --------------------------
    // 6️⃣ GIAO DỊCH & TÌM KIẾM
    // --------------------------
    const transactionTableBody = document.getElementById("transactionTableBody");
    function renderTransactions(list = transactions) {
        if (!transactionTableBody) return;
        transactionTableBody.innerHTML = "";
        list.forEach(t => {
            transactionTableBody.innerHTML += `
                <tr>
                    <td>${t.code}</td>
                    <td>${t.fund}</td>
                    <td>${t.date}</td>
                    <td>${t.type}</td>
                    <td>${t.amount.toLocaleString()} ₫</td>
                    <td>${t.note}</td>
                </tr>`;
        });
    }
    renderTransactions();

    const searchInput = document.getElementById("searchTransaction");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const val = this.value.toLowerCase();
            const filtered = transactions.filter(t =>
                t.fund.toLowerCase().includes(val) || t.code.toLowerCase().includes(val)
            );
            renderTransactions(filtered);
        });
    }

    const transactionForm = document.getElementById("addTransactionForm");
    if (transactionForm) {
        transactionForm.addEventListener("submit", e => {
            e.preventDefault();
            const newT = {
                code: "T" + (transactions.length + 1).toString().padStart(3, "0"),
                fund: transactionFund.value,
                type: transactionType.value,
                amount: Number(transactionAmount.value),
                date: transactionDate.value || new Date().toISOString().split("T")[0],
                note: transactionNote.value
            };
            transactions.push(newT);
            renderTransactions();
            renderReport();
            $("#addTransactionModal").modal("hide");
            e.target.reset();
        });
    }


    // -- TAB Bổ sung - tác nghiệp
    // ---- Render select options ----
    const lotOptions = ["Chọn lô", "Lô 1", "Lô 2"];
    const sourceOptions = ["Mua", "Tặng", "Trao đổi"];

    lotOptions.forEach(opt => $('#lotSelect').append(`<option>${opt}</option>`));
    sourceOptions.forEach(opt => $('#sourceSelect').append(`<option>${opt}</option>`));

    // ---- Render Quick Catalog Table ----
    const quickCatalogData = [
        { name: "Sách JS nâng cao", author: "Nguyễn Văn A", code: "JS001", shelf: "Kệ A1", lang: "Tiếng Việt" },
        { name: "Sách Python cơ bản", author: "Trần Thị B", code: "PY001", shelf: "Kệ B2", lang: "Tiếng Việt" }
    ];
    const $quickCatalogTbody = $('#quickCatalogTable tbody');
    quickCatalogData.forEach(item => {
        $quickCatalogTbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.author}</td>
                <td>${item.code}</td>
                <td>${item.shelf}</td>
                <td>${item.lang}</td>
            </tr>
        `);
    });

    // ---- Render Generate ID Table ----
    const generateIdData = [
        { code: "BS-2025-001", name: "Sách JS nâng cao", registration: "DK001", internalId: "ID001" },
        { code: "BS-2025-002", name: "Sách Python cơ bản", registration: "DK002", internalId: "ID002" }
    ];
    const $generateIdTbody = $('#generateIdTable tbody');
    generateIdData.forEach(item => {
        $generateIdTbody.append(`
            <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.registration}</td>
                <td>${item.internalId}</td>
            </tr>
        `);
    });

    // ---- Render Manage Source Table ----
    const manageSourceData = [
        { name: "Sách JS nâng cao", provider: "Cty ABC", quantity: 5, receivedDate: "2025-10-18" },
        { name: "Sách Python cơ bản", provider: "Cty XYZ", quantity: 3, receivedDate: "2025-10-19" }
    ];
    const $manageSourceTbody = $('#manageSourceTable tbody');
    manageSourceData.forEach(item => {
        $manageSourceTbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.provider}</td>
                <td>${item.quantity}</td>
                <td>${item.receivedDate}</td>
            </tr>
        `);
    });

    // ---- Render Print Label Table ----
    const printLabelData = [
        { name: "Sách JS nâng cao", provider: "Cty ABC", quantity: 5 },
        { name: "Sách Python cơ bản", provider: "Cty XYZ", quantity: 3 }
    ];
    const $printLabelTbody = $('#printLabelTable tbody');
    printLabelData.forEach(item => {
        $printLabelTbody.append(`
            <tr>
                <td><input type="checkbox"></td>
                <td>${item.name}</td>
                <td>${item.provider}</td>
                <td>${item.quantity}</td>
            </tr>
        `);
    });

    // ---- Render Report Table Tự động lọc ----
    const reportData = [
        { month: "10/2025", language: "Tiếng Việt", topic: "Khoa học", added: 8, checked: 6, delivered: 5, note: "2 đang chờ kiểm tra" },
        { month: "10/2025", language: "Tiếng Anh", topic: "Văn học", added: 5, checked: 5, delivered: 5, note: "" },
        { month: "11/2025", language: "Tiếng Việt", topic: "Văn học", added: 7, checked: 7, delivered: 7, note: "" },
        { month: "11/2025", language: "Tiếng Anh", topic: "Khoa học", added: 4, checked: 4, delivered: 4, note: "" }
    ];

    const reportTbody = document.querySelector("#reportTable tbody");
    const filterMonth = document.getElementById("filterMonth");
    const filterLanguage = document.getElementById("filterLanguage");
    const filterTopic = document.getElementById("filterTopic");

    function renderReportTable() {
        reportTbody.innerHTML = "";

        const month = filterMonth.value;
        const lang = filterLanguage.value;
        const topic = filterTopic.value;

        const filtered = reportData.filter(item =>
            (!month || item.month === month) &&
            (!lang || item.language === lang) &&
            (!topic || item.topic === topic)
        );

        if (filtered.length === 0) {
            reportTbody.innerHTML = `<tr><td colspan="7" class="text-center">Không có dữ liệu</td></tr>`;
            return;
        }

        filtered.forEach(item => {
            reportTbody.innerHTML += `
            <tr>
                <td>${item.month}</td>
                <td>${item.language}</td>
                <td>${item.topic}</td>
                <td>${item.added}</td>
                <td>${item.checked}</td>
                <td>${item.delivered}</td>
                <td>${item.note}</td>
            </tr>
        `;
        });
    }

    // Gắn sự kiện change cho select để tự động lọc
    [filterMonth, filterLanguage, filterTopic].forEach(el => el.addEventListener("change", renderReportTable));

    // Render lần đầu
    renderReportTable();


    // Dữ liệu kho
    let warehouseData = [
        { name: "Sách JS nâng cao", status: "Trao đổi", quantity: 3, note: "Kho A" },
        { name: "Sách Python cơ bản", status: "Bán", quantity: 2, note: "Kho B" }
    ];

    const $warehouseTbody = $('#warehouseTable tbody');

    function renderWarehouse(filter = "") {
        $warehouseTbody.empty();
        warehouseData.forEach((item, index) => {
            if (filter && item.status !== filter) return;
            $warehouseTbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.status}</td>
                <td>${item.quantity}</td>
                <td>${item.note}</td>
                <td>
                    <button class="btn btn-sm btn-warning editWarehouse" data-index="${index}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-danger deleteWarehouse" data-index="${index}"> <i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `);
        });
    }

    renderWarehouse();

    // Lọc tự động
    $('#warehouseFilter').change(function () {
        renderWarehouse(this.value);
    });

    $('#addWarehouseBtn').click(function () {
        $('#warehouseForm')[0].reset();
        $('#editing-index').val("");
        $('#warehouseModal').modal('show');
    });

    $('#save-warehouse').click(function () {
        const idx = $('#editing-index').val();
        const item = {
            name: $('#wh-name').val().trim(),
            status: $('#wh-status').val(),
            quantity: parseInt($('#wh-quantity').val()),
            note: $('#wh-note').val().trim()
        };

        if (!item.name || !item.status || !item.quantity) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (idx === "") {
            warehouseData.push(item); // Thêm mới
        } else {
            warehouseData[idx] = item; // Sửa
        }

        $('#warehouseModal').modal('hide');
        renderWarehouse($('#warehouseFilter').val());
    });

    // Sửa
    $(document).on('click', '.editWarehouse', function () {
        const idx = $(this).data('index');
        const item = warehouseData[idx];
        $('#wh-name').val(item.name);
        $('#wh-status').val(item.status);
        $('#wh-quantity').val(item.quantity);
        $('#wh-note').val(item.note);
        $('#editing-index').val(idx);
        $('#warehouseModal').modal('show');
    });


    // Lưu dữ liệu thêm / sửa
    $('#warehouseForm').submit(function (e) {
        e.preventDefault();
        const item = {
            name: $('#warehouseName').val().trim(),
            status: $('#warehouseStatus').val(),
            quantity: parseInt($('#warehouseQuantity').val()),
            note: $('#warehouseNote').val().trim()
        };
        const idx = $('#warehouseIndex').val();
        if (idx === "") {
            // Thêm mới
            warehouseData.push(item);
        } else {
            // Sửa
            warehouseData[idx] = item;
        }
        $('#warehouseModal').modal('hide');
        renderWarehouse($('#warehouseFilter').val());
    });

    // Sửa
    $(document).on('click', '.editWarehouse', function () {
        const idx = $(this).data('index');
        const item = warehouseData[idx];
        $('#warehouseName').val(item.name);
        $('#warehouseStatus').val(item.status);
        $('#warehouseQuantity').val(item.quantity);
        $('#warehouseNote').val(item.note);
        $('#warehouseIndex').val(idx);
        $('#warehouseModal').modal('show');
    });

    // Xóa
    $(document).on('click', '.deleteWarehouse', function () {
        const idx = $(this).data('index');
        if (confirm(`Xóa tài liệu "${warehouseData[idx].name}" khỏi kho?`)) {
            warehouseData.splice(idx, 1);
            renderWarehouse($('#warehouseFilter').val());
        }
    });

    $('#quick_catalog button').click(function (e) {
        e.preventDefault(); // tránh submit form

        // Lấy giá trị từ các input
        const name = $('#quick_catalog input').eq(0).val().trim();
        const author = $('#quick_catalog input').eq(1).val().trim();
        const code = $('#quick_catalog input').eq(2).val().trim();

        // Nếu không nhập, lấy dữ liệu mẫu đầu tiên
        const newItem = {
            name: name || quickCatalogData[0].name,
            author: author || quickCatalogData[0].author,
            code: code || quickCatalogData[0].code,
            shelf: quickCatalogData[0].shelf,
            lang: quickCatalogData[0].lang
        };

        // Thêm vào quickCatalogData
        quickCatalogData.push(newItem);

        // Render lại bảng
        const $tbody = $('#quickCatalogTable tbody');
        $tbody.empty();
        quickCatalogData.forEach(item => {
            $tbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.author}</td>
                <td>${item.code}</td>
                <td>${item.shelf}</td>
                <td>${item.lang}</td>
            </tr>
        `);
        });

        // Xóa input sau khi kế thừa
        $('#quick_catalog input').val('');
    });

    $('#checkDuplicateBtn').click(function () {
        const inputVal = $('#duplicateInput').val().trim().toLowerCase();
        if (!inputVal) {
            alert("Nhập ISBN / Tên tài liệu để kiểm tra");
            return;
        }

        // kiểm tra trong quickCatalogData
        const found = quickCatalogData.some(item =>
            item.code.toLowerCase() === inputVal || item.name.toLowerCase() === inputVal
        );

        // Hiển thị kết quả và hiện div
        $('#duplicateResult')
            .text(found ? "Kết quả: Đã tồn tại" : "Kết quả: Chưa trùng")
            .show();
    });

    $('#generateRegBtn').click(function () {
        // Mỗi lần click, thêm chữ "DKxxx" giả lập
        generateIdData.forEach((item, index) => {
            item.registration = "DK" + String(index + 101).padStart(3, "0");
        });
        renderGenerateIdTable();
    });

    $('#generateInternalIdBtn').click(function () {
        generateIdData.forEach((item, index) => {
            item.internalId = "ID" + String(index + 101).padStart(3, "0");
        });
        renderGenerateIdTable();
    });

    // hàm render lại table
    function renderGenerateIdTable() {
        const $tbody = $('#generateIdTable tbody');
        $tbody.empty();
        generateIdData.forEach(item => {
            $tbody.append(`
            <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.registration}</td>
                <td>${item.internalId}</td>
            </tr>
        `);
        });
    }

    // Khi nhấn nút Thêm tài liệu, mở modal
    $('#addSourceBtn').click(function () {
        $('#addSourceModal').modal('show');
    });

    // Khi nhấn nút Lưu trong modal
    $('#saveSourceBtn').click(function () {
        const newItem = {
            name: $('#sourceName').val(),
            provider: $('#sourceProvider').val(),
            quantity: parseInt($('#sourceQuantity').val()),
            receivedDate: $('#sourceReceivedDate').val(),
            type: $('#sourceType').val()
        };

        // Kiểm tra nếu có trường trống
        if (!newItem.name || !newItem.provider || !newItem.quantity || !newItem.receivedDate) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        // Thêm vào dữ liệu
        manageSourceData.push(newItem);

        // Render lại bảng
        const $tbody = $('#manageSourceTable tbody');
        $tbody.empty();
        manageSourceData.forEach(item => {
            $tbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.provider}</td>
                <td>${item.quantity}</td>
                <td>${item.receivedDate}</td>
            </tr>
        `);
        });

        // Đóng modal và reset form
        $('#addSourceModal').modal('hide');
        $('#addSourceForm')[0].reset();
    });


    function renderManageSourceTable() {
        const $tbody = $('#manageSourceTable tbody');
        $tbody.empty();
        manageSourceData.forEach(item => {
            $tbody.append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.provider}</td>
                <td>${item.quantity}</td>
                <td>${item.receivedDate}</td>
            </tr>
        `);
        });
    }

    $('#selectAllPrint').change(function () {
        const checked = $(this).is(':checked');
        $('#printLabelTable tbody input[type=checkbox]').prop('checked', checked);
    });

    $('#printSpineBtn').click(function () {
        const selected = $('#printLabelTable tbody input[type=checkbox]:checked');
        if (selected.length === 0) { alert("Chọn tài liệu để in nhãn gáy"); return; }
        alert("Đang in nhãn gáy cho " + selected.length + " tài liệu");
    });

    $('#printBarcodeBtn').click(function () {
        const selected = $('#printLabelTable tbody input[type=checkbox]:checked');
        if (selected.length === 0) { alert("Chọn tài liệu để in mã vạch"); return; }
        alert("Đang in mã vạch cho " + selected.length + " tài liệu");
    });



});

/* ===========================================================
   🧾 TAB 4: QUẢN LÝ KHO
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {
    // Dữ liệu mẫu
    const warehouses = [
        { code: "K001", name: "Kho A", type: "Chính", status: "Mở", note: "Kho chính tổng" },
        { code: "K002", name: "Kho B", type: "Phụ", status: "Khóa", note: "Đang bảo trì" }
    ];
    const reports = [
        { item: "Sách JS", stock: 100, inTransit: 20, lost: 0 },
    ];
    const inventory = [
        { barcode: "H001", name: "Sách JS", systemQty: 50, actualQty: 50, status: "Đúng" },
        { barcode: "H002", name: "Sách Python", systemQty: 30, actualQty: 28, status: "Thiếu" }
    ];
    const bulkItems = [
        { code: "H001", name: "Sách JS", status: "Tồn" },
        { code: "H002", name: "Sách Python", status: "Mất" }
    ];

    const reportData = {
        "Kho A": [
            { item: "Sách JS nâng cao", stock: 120, inTransit: 15, lost: 2 },
            { item: "Sách Python cơ bản", stock: 80, inTransit: 5, lost: 0 },
        ],
        "Kho B": [
            { item: "Sách C# nâng cao", stock: 90, inTransit: 10, lost: 1 },
            { item: "Sách Java toàn tập", stock: 60, inTransit: 7, lost: 3 },
        ]
    };

    // Khi bấm nút Xem báo cáo
    $("#view-report").on("click", function () {
        const warehouse = $("#report-warehouse").val();
        const from = $("#report-from").val();
        const to = $("#report-to").val();

        const tbody = $("#report-list");
        tbody.empty();

        if (!warehouse) {
            alert("Vui lòng chọn kho cần xem báo cáo!");
            return;
        }

        // Lấy dữ liệu theo kho
        const data = reportData[warehouse] || [];

        if (data.length === 0) {
            tbody.append(`<tr><td colspan="4" class="text-center text-muted">Không có dữ liệu báo cáo</td></tr>`);
            return;
        }

        // Render bảng
        $.each(data, function (i, r) {
            const tr = $(`
            <tr>
                <td>${r.item}</td>
                <td>${r.stock}</td>
                <td>${r.inTransit}</td>
                <td>${r.lost}</td>
            </tr>
        `);
            tbody.append(tr);
        });

        // Mô phỏng log ra console
        console.log(`Báo cáo ${warehouse} từ ${from} đến ${to}`, data);
    });

    // Danh sách đăng ký cá biệt (mô phỏng)
    const individualRegs = [];

    // Render kho
    function renderWarehouses() {
        const tbody = $("#warehouse-list");
        tbody.empty();
        $.each(warehouses, function (i, w) {
            const tr = $(`
                <tr>
                    <td>${w.code}</td>
                    <td>${w.name}</td>
                    <td>${w.type}</td>
                   <td class="text-center">
  <span class="status-icon" title="${w.status}">
    <i class="fa-solid ${w.status === "Mở" ? "fa-unlock text-success" : "fa-lock text-danger"}"></i>
  </span>
</td>
                   <td>${w.note || ""}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-warehouse" data-index="${i}"> <i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-warning btn-sm toggle-status" data-index="${i}" 
        title="${w.status === "Mở" ? "Khóa kho" : "Mở kho"}">
  <i class="fa-solid ${w.status === "Mở" ? "fa-lock" : "fa-lock-open"}"></i>
</button>
                        <button class="btn btn-success btn-sm btn-register" data-name="${w.name}">Đăng ký cá biệt</button>
                    </td>
                </tr>
            `);
            tbody.append(tr);
        });
    }

    // Render báo cáo
    function renderReports() {
        const tbody = $("#report-list");
        tbody.empty();
        $.each(reports, function (i, r) {
            const tr = $(`
                <tr>
                    <td>${r.item}</td>
                    <td>${r.stock}</td>
                    <td>${r.inTransit}</td>
                    <td>${r.lost}</td>
                </tr>
            `);
            tbody.append(tr);
        });
        const select = $("#report-warehouse");
        select.empty();
        $.each(warehouses, function (i, w) {
            select.append(`<option>${w.name}</option>`);
        });
    }

    function renderInventory() {
        const tbody = $("#inventory-list");
        tbody.empty();

        if (inventory.length === 0) {
            tbody.append(`<tr><td colspan="5" class="text-center text-muted">Chưa có dữ liệu kiểm kê</td></tr>`);
            return;
        }

        $.each(inventory, function (i, inv) {
            const tr = $(`
            <tr>
                <td>${inv.barcode}</td>
                <td>${inv.name}</td>
                <td>${inv.systemQty}</td>
                <td>
                    <input type="number" class="form-control input-actual" 
                           value="${inv.actualQty}" min="0" data-index="${i}">
                </td>
                <td>
                    <span class="label ${inv.status === "Đúng" ? "label-success" : inv.status === "Thiếu" ? "label-warning" : "label-info"}">
                        ${inv.status}
                    </span>
                </td>
            </tr>
        `);
            tbody.append(tr);
        });
    }

    // Thêm kiểm kê mới
    $("#add-inventory").on("click", function () {
        const code = $("#scan-barcode").val().trim();
        if (code === "") {
            alert("Vui lòng nhập mã vạch!");
            return;
        }

        // Kiểm tra trùng
        const exist = inventory.find(item => item.barcode === code);
        if (exist) {
            alert("Mã này đã tồn tại trong danh sách kiểm kê!");
            return;
        }

        inventory.push({
            barcode: code,
            name: "Mặt hàng mới",
            systemQty: Math.floor(Math.random() * 50) + 10, // số ngẫu nhiên mô phỏng
            actualQty: 0,
            status: "Chưa kiểm"
        });

        $("#scan-barcode").val("");
        renderInventory();
    });

    // Khi thay đổi số lượng thực tế → cập nhật trạng thái
    $(document).on("input", ".input-actual", function () {
        const idx = $(this).data("index");
        const actual = parseInt($(this).val());
        const system = inventory[idx].systemQty;

        if (isNaN(actual)) return;

        let status = "Đúng";
        if (actual < system) status = "Thiếu";
        else if (actual > system) status = "Dư";

        inventory[idx].actualQty = actual;
        inventory[idx].status = status;

        renderInventory();
    });

    // Render hàng loạt
    function renderBulk() {
        const tbody = $("#bulk-list");
        tbody.empty();

        $.each(bulkItems, function (i, b) {
            let labelClass = "label-default";
            if (b.status.includes("Tồn")) labelClass = "label-success";
            else if (b.status.includes("Mất")) labelClass = "label-danger";
            else if (b.status.includes("chuyển")) labelClass = "label-info";

            const tr = $(`
            <tr>
                <td><input type="checkbox" class="bulk-checkbox" data-index="${i}"></td>
                <td>${b.code}</td>
                <td>${b.name}</td>
                <td><span class="label ${labelClass}">${b.status}</span></td>
            </tr>
        `);
            tbody.append(tr);
        });
    }


    // ====== 🔹 PHẦN THÊM MỚI: Đăng ký cá biệt phục vụ lưu thông ======
    // Mở modal đăng ký cá biệt
    $(document).on("click", ".btn-register", function () {
        const warehouseName = $(this).data("name");
        $("#individualWarehouse").val(warehouseName);
        $("#modalWarehouseName").text(`Đăng ký cá biệt phục vụ lưu thông – ${warehouseName}`);
        $("#individualModal").modal("show");
    });


    // Lưu đăng ký cá biệt
    $("#saveIndividualBtn").on("click", function () {
        const whName = $("#individualWarehouse").val();
        const code = $("#individualCode").val();
        const date = $("#individualDate").val();
        const note = $("#individualNote").val();

        if (code.trim() === "") {
            alert("Vui lòng nhập mã tài liệu / mã vạch!");
            return;
        }

        individualRegs.push({
            warehouse: whName,
            code,
            date,
            note
        });

        $("#individualModal").modal("hide");
        $("#individualForm")[0].reset();

        alert(`Đã đăng ký cá biệt cho ${whName} thành công!`);
    });
    // ================================================================

    $(document).ready(function () {
        // Tick toàn bộ checkbox
        $("#checkAllCopies").on("click", function () {
            $("#copiesTable input[type='checkbox']").prop("checked", this.checked);
        });

        // Mô phỏng kích hoạt lưu thông
        $("#activateCopiesBtn").on("click", function () {
            $("#copiesTable input[type='checkbox']:checked").each(function () {
                const row = $(this).closest("tr");
                row.find("td:last").text("Lưu thông ✅");
            });
            alert("Đã kích hoạt lưu thông cho các bản cá biệt được chọn!");
        });
    });

    // Lưu / cập nhật kho
    $("#save-warehouse").off("click").on("click", function () {
        const idx = $("#editing-index").val().trim();
        const code = $("#wh-code").val().trim();
        const name = $("#wh-name").val().trim();
        const type = $("#wh-type").val().trim();
        const status = $("#wh-status").val().trim();
        const note = $("#wh-note").val().trim();

        if (!code || !name || !type || !status) {
            alert("Vui lòng nhập đủ thông tin kho!");
            return;
        }

        if (idx === "") {
            warehouses.push({ code, name, type, status, note });
        } else {
            warehouses[idx] = { code, name, type, status, note };
        }

        $("#warehouseModal").modal("hide");
        $("#warehouseForm")[0].reset();
        renderWarehouses();
        renderReports();
    });


    // Sửa kho
    $(document).on("click", ".edit-warehouse", function () {
        const idx = $(this).data("index");
        const wh = warehouses[idx];
        $("#wh-code").val(wh.code);
        $("#wh-name").val(wh.name);
        $("#wh-type").val(wh.type);
        $("#wh-status").val(wh.status);
        $("#editing-index").val(idx);
        $("#warehouseModal").modal('show');
    });

    // Khóa / Mở kho
    $(document).on("click", ".toggle-status", function () {
        const idx = $(this).data("index");
        warehouses[idx].status = warehouses[idx].status === "Mở" ? "Khóa" : "Mở";
        renderWarehouses();
        renderReports();
    });

    // Thêm kiểm kê
    $("#add-inventory").click(function () {
        const code = $("#scan-barcode").val();
        if (code !== "") {
            inventory.push({ barcode: code, name: "Mặt hàng mới", systemQty: 0, actualQty: 0, status: "Đúng" });
            renderInventory();
            $("#scan-barcode").val("");
        }
    });

    // Chọn tất cả hàng loạt
    $("#bulk-check-all").change(function () {
        $(".bulk-checkbox").prop("checked", $(this).prop("checked"));
    });

    // Đánh dấu mất
    $("#mark-lost").click(function () {
        $(".bulk-checkbox:checked").each(function () {
            const idx = $(this).data("index");
            bulkItems[idx].status = "Mất";
        });
        renderBulk();
    });

    // Khôi phục
    $("#restore").click(function () {
        $(".bulk-checkbox:checked").each(function () {
            const idx = $(this).data("index");
            bulkItems[idx].status = "Tồn";
        });
        renderBulk();
    });
    // ===== 🔹 CHUYỂN KHO =====
    $("#transfer").click(function () {
        // Lấy danh sách hàng được chọn
        const selected = $(".bulk-checkbox:checked");

        if (selected.length === 0) {
            alert("Vui lòng chọn ít nhất một hàng để chuyển kho!");
            return;
        }

        // Đổ danh sách kho đích (trừ khi bị trùng)
        const select = $("#transferToWarehouse");
        select.empty();
        select.append('<option value="">-- Chọn kho đích --</option>');
        warehouses.forEach(w => select.append(`<option value="${w.name}">${w.name}</option>`));

        // Mở modal chuyển kho
        $("#transferModal").modal("show");
    });

    // Khi nhấn "Xác nhận chuyển"
    $("#confirmTransfer").click(function () {
        const targetWarehouse = $("#transferToWarehouse").val();
        const note = $("#transferNote").val();

        if (!targetWarehouse) {
            alert("Vui lòng chọn kho đích!");
            return;
        }

        // Lấy các mục được chọn
        $(".bulk-checkbox:checked").each(function () {
            const idx = $(this).data("index");
            const item = bulkItems[idx];
            item.status = `Đã chuyển đến ${targetWarehouse}`;
        });

        $("#transferModal").modal("hide");
        $("#transferForm")[0].reset();
        renderBulk();

        alert(`Đã chuyển các hàng được chọn sang kho ${targetWarehouse} thành công!`);
    });


    // Render lần đầu
    renderWarehouses();
    renderReports();
    renderInventory();
    renderBulk();
});

/* ===========================================================
   🧾 TAB 5: Tiếp nhận/Kiểm nhận
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {

    // Dữ liệu phiếu tiếp nhận (tạm thời)
    const receiveItems = [
        {
            code: "TL001",
            name: "Sách JS nâng cao",
            orderedQty: 10,
            actualQty: 10,
            note: ""
        },
        {
            code: "TL002",
            name: "Sách Python cơ bản",
            orderedQty: 5,
            actualQty: 5,
            note: ""
        }
    ];

    // Dữ liệu nhật ký tiếp nhận
    const receiveLog = [
        {
            date: "21/10/2025",
            code: "PN-2025-001",
            user: "Nguyễn Văn A",
            totalReceived: 30,
            diff: 0,
            note: "-"
        }
    ];

    // Render phiếu tiếp nhận
    const receiveList = document.getElementById('receive-list');
    let totalReceived = 0;
    let totalDiff = 0;

    receiveItems.forEach(item => {
        const tr = document.createElement('tr');
        const diff = item.actualQty - item.orderedQty;
        totalReceived += item.actualQty;
        totalDiff += diff;

        tr.innerHTML = `
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td class="ordered-qty text-center">${item.orderedQty}</td>
        <td><input type="number" value="${item.actualQty}" class="form-control input-sm actual-qty"></td>
        <td class="diff text-center">${diff}</td>
        <td><input type="text" class="form-control input-sm note" value="${item.note}"></td>
    `;
        receiveList.appendChild(tr);
    });

    // Cập nhật tổng SL
    document.getElementById('totalReceived').textContent = totalReceived;
    document.getElementById('totalDiff').textContent = totalDiff;

    // Render nhật ký tiếp nhận
    const receiveLogBody = document.getElementById('receive-log-body');
    receiveLog.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${log.date}</td>
        <td>${log.code}</td>
        <td>${log.user}</td>
        <td>${log.totalReceived}</td>
        <td>${log.diff}</td>
        <td>${log.note}</td>
    `;
        receiveLogBody.appendChild(tr);
    });


    // Danh sách nhật ký tiếp nhận (mô phỏng dữ liệu)
    const receiveLogs = [];

    // Khi nhấn Lưu phiếu
    $("#saveReceive").click(function () {
        const form = $("#receiveForm");
        const soPhieu = form.find("input[type='text']").eq(0).val().trim() || "PN-" + Date.now();
        const ngay = form.find("input[type='date']").val() || new Date().toISOString().split("T")[0];
        const nguoiLap = form.find("input[type='text']").eq(1).val().trim() || "Không rõ";

        // Tính tổng số lượng nhận
        let tongNhan = 0;
        $("#receive-list tr").each(function () {
            const qty = parseInt($(this).find("input[type='number']").val());
            if (!isNaN(qty)) tongNhan += qty;
        });

        // Lấy ghi chú (nếu có)
        const note = $("#receive-list tr:first input[type='text']").val().trim() || "-";

        // Tạo đối tượng log mới
        const log = {
            date: ngay,
            code: soPhieu,
            creator: nguoiLap,
            quantity: tongNhan,
            note: note
        };

        // Thêm vào mảng
        receiveLogs.push(log);

        // Render lại bảng nhật ký
        const tbody = $("#receive-log table tbody");
        tbody.empty();
        receiveLogs.forEach(r => {
            tbody.append(`
                <tr>
                    <td>${r.date}</td>
                    <td>${r.code}</td>
                    <td>${r.creator}</td>
                    <td>${r.quantity}</td>
                    <td>${r.note}</td>
                </tr>
            `);
        });

        // Thông báo mô phỏng
        alert("Đã lưu phiếu tiếp nhận thành công!");
    });
    // --- Tự động tính chênh lệch khi sửa số lượng ---
    $(document).on("input", ".actual-qty", function () {
        const row = $(this).closest("tr");
        const ordered = parseInt(row.find(".ordered-qty").text()) || 0;
        const actual = parseInt($(this).val()) || 0;
        const diff = actual - ordered;
        row.find(".diff").text(diff);

        // Tính tổng thực nhận
        let total = 0;
        $(".actual-qty").each(function () {
            const val = parseInt($(this).val());
            if (!isNaN(val)) total += val;
        });
        $("#totalReceived").text(total);
    });
    // --- Hàm cập nhật chênh lệch và tổng ---
    function updateTotals() {
        let totalReceived = 0;
        let totalDiff = 0;

        $("#receive-list tr").each(function () {
            const ordered = parseInt($(this).find(".ordered-qty").text()) || 0;
            const actual = parseInt($(this).find(".actual-qty").val()) || 0;
            const diff = actual - ordered;
            totalReceived += actual;
            totalDiff += diff;

            const diffCell = $(this).find(".diff");
            if (diff < 0) diffCell.text(`Thiếu ${Math.abs(diff)}`).css("color", "red");
            else if (diff > 0) diffCell.text(`Dư ${diff}`).css("color", "green");
            else diffCell.text("Đúng").css("color", "black");
        });

        // Tổng thực nhận
        $("#totalReceived").text(totalReceived);

        // Tổng chênh lệch
        const totalDiffCell = $("#totalDiff");
        if (totalDiff < 0) totalDiffCell.text(`Thiếu ${Math.abs(totalDiff)}`).css("color", "red");
        else if (totalDiff > 0) totalDiffCell.text(`Dư ${totalDiff}`).css("color", "green");
        else totalDiffCell.text("Đúng").css("color", "black");
    }

    // --- Tự động cập nhật khi thay đổi số lượng nhận ---
    $(document).on("input", ".actual-qty", updateTotals);

    // --- Lưu phiếu ---
    $("#saveReceive").click(function () {
        updateTotals();

        const code = $("#receiveCode").val().trim() || "PN-" + new Date().getTime();
        const date = $("#receiveDate").val() || new Date().toLocaleDateString('vi-VN');
        const user = $("#receiveUser").val().trim() || "Chưa rõ";

        const total = $("#totalReceived").text();
        const diff = $("#totalDiff").text();

        // Ghi chú tổng hợp tất cả sản phẩm
        const totalNote = $("#receive-list tr").map(function () {
            const code = $(this).find("td:first").text();
            const note = $(this).find(".note").val().trim() || "OK";
            return `${code}: ${note}`;
        }).get().join("; ");

        // Thêm vào nhật ký
        $("#receive-log-table tbody").append(`
            <tr>
                <td>${date}</td>
                <td>${code}</td>
                <td>${user}</td>
                <td>${total}</td>
                <td>${diff}</td>
                <td>${totalNote}</td>
            </tr>
        `);

        alert("✅ Đã lưu phiếu tiếp nhận!");
        $("#receiveSubTabs a[href='#receive-log']").tab("show");
    });

    // Khởi tạo lần đầu
    updateTotals();
});

/* ===========================================================
   🧾 TAB 6: HĐ NHÀ CUNG CẤP
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {
    // ====== DỮ LIỆU GIẢ ======
    let supplierInvoices = [
        { code: "HD-001", supplier: "Nhà sách ABC", date: "2025-10-20", contract: "HĐ-1001", status: "Chưa thanh toán" },
        { code: "HD-002", supplier: "Nhà sách XYZ", date: "2025-10-21", contract: "HĐ-1002", status: "Đã thanh toán" }
    ];

    let supplierReconcile = [
        { supplier: "Nhà sách ABC", beginningDebt: 5000000, debtGenerated: 2000000, debtPaid: 1000000, endingDebt: 6000000, dueDate: "2025-10-25", status: "Chưa thanh toán", reminder: true },
        { supplier: "Nhà sách XYZ", beginningDebt: 3000000, debtGenerated: 1500000, debtPaid: 2000000, endingDebt: 2500000, dueDate: "2025-10-28", status: "Đã thanh toán", reminder: false }
    ];

    const invoicesBody = document.getElementById("invoices-body");
    const reconcileBody = document.getElementById("reconcile-body");
    const filterSupplier = document.getElementById("filterSupplier");

    // ====== HÀM HIỂN THỊ ======
    function renderInvoices(data = supplierInvoices) {
        invoicesBody.innerHTML = "";
        data.forEach(inv => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${inv.code}</td>
        <td>${inv.supplier}</td>
        <td>${inv.date}</td>
        <td>${inv.contract}</td>
        <td><span class="label ${inv.status.includes('Chưa') ? 'label-warning' : 'label-success'}">${inv.status}</span></td>
        <td>
          <button class="btn btn-info btn-sm view-detail"><i class="fa-solid fa-eye"></i></button>
        </td>`;
            invoicesBody.appendChild(tr);
        });
    }

    function renderReconcile(data = supplierReconcile) {
        reconcileBody.innerHTML = "";
        data.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${r.supplier}</td>
        <td>${r.beginningDebt.toLocaleString()}</td>
        <td>${r.debtGenerated.toLocaleString()}</td>
        <td>${r.debtPaid.toLocaleString()}</td>
        <td>${r.endingDebt.toLocaleString()}</td>
        <td>${r.dueDate}</td>
        <td><span class="label ${r.status.includes('Chưa') ? 'label-warning' : 'label-success'}">${r.status}</span></td>
        <td>${r.reminder ? '<button class="btn btn-info btn-sm reminder">Nhắc hạn</button>' : '-'}</td>`;
            reconcileBody.appendChild(tr);
        });
    }

    // ====== CHỨC NĂNG ======
    renderInvoices();
    renderReconcile();
    supplierReconcile.forEach(r => filterSupplier.innerHTML += `<option>${r.supplier}</option>`);

    // Tìm kiếm
    document.getElementById("searchInvoice").addEventListener("keyup", e => {
        const keyword = e.target.value.toLowerCase();
        const filtered = supplierInvoices.filter(i =>
            i.code.toLowerCase().includes(keyword) || i.supplier.toLowerCase().includes(keyword)
        );
        renderInvoices(filtered);
    });

    // Modal tạo mới
    $("#addInvoiceBtn").on("click", () => $("#invoiceModal").modal("show"));
    $("#saveInvoice").on("click", function () {
        const newInv = {
            code: $("#invCode").val(),
            supplier: $("#invSupplier").val(),
            contract: $("#invContract").val(),
            date: $("#invDate").val(),
            status: "Chưa thanh toán"
        };
        supplierInvoices.push(newInv);
        renderInvoices();
        $("#invoiceModal").modal("hide");
    });

    // Nhắc hạn
    $("#reconcile-body").on("click", ".reminder", function () {
        const supplier = $(this).closest("tr").find("td:first").text();
        alert("Đã gửi nhắc hạn cho " + supplier);
    });

    // Lọc công nợ
    $("#filterSupplier").on("change", function () {
        const val = this.value;
        renderReconcile(val ? supplierReconcile.filter(r => r.supplier === val) : supplierReconcile);
    });

    // Làm mới
    $("#refreshReconcile").on("click", () => alert("✅ Dữ liệu công nợ đã được cập nhật!"));
});

