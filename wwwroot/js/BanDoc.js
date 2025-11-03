$(document).ready(function () {

    // Dữ liệu bạn đọc
    const readersData = [];
    for (let i = 1; i <= 23; i++) {
        const group = i % 2 ? 'Sinh viên' : 'Giảng viên';
        const status = i % 3 === 0 ? 'Hết hạn' : (i % 3 === 1 ? 'Hoạt động' : 'Sắp hết hạn');
        readersData.push({
            stt: i,
            code: `BD${String(i).padStart(3, '0')}`,
            name: `Bạn đọc ${i}`,
            email: `bandoc${i}@@mail.com`,
            group: group,
            issueDate: '01/01/2025',
            expireDate: '01/01/2026',
            status: status
        });
    }

    // ===== DỮ LIỆU NHÓM BẠN ĐỌC =====
    let groupsData = [
        { name: 'Sinh viên', maxBooks: 5, loanDays: 14, renewLimit: 1, penalty: 2000, allowDigital: 1 },
        { name: 'Giảng viên', maxBooks: 10, loanDays: 30, renewLimit: 'Không giới hạn', penalty: 0, allowDigital: 1 },
        { name: 'Sinh viên', maxBooks: 5, loanDays: 14, renewLimit: 1, penalty: 2000, allowDigital: 1 },
        { name: 'Giảng viên', maxBooks: 10, loanDays: 30, renewLimit: 'Không giới hạn', penalty: 0, allowDigital: 1 },
        { name: 'Sinh viên', maxBooks: 5, loanDays: 14, renewLimit: 1, penalty: 2000, allowDigital: 1 },
        { name: 'Giảng viên', maxBooks: 10, loanDays: 30, renewLimit: 'Không giới hạn', penalty: 0, allowDigital: 1 },
        { name: 'Sinh viên', maxBooks: 5, loanDays: 14, renewLimit: 1, penalty: 2000, allowDigital: 1 },
        { name: 'Giảng viên', maxBooks: 10, loanDays: 30, renewLimit: 'Không giới hạn', penalty: 0, allowDigital: 1 }

    ];
    let currentEditGroupIndex = null;

    function renderReadersTable() {
        const tbody = $('#readerTable tbody');
        tbody.empty();

        readersData.forEach((r, idx) => {
            const labelClass = r.status === 'Hoạt động' ? 'success' :
                (r.status === 'Sắp hết hạn' ? 'warning' : 'danger');

            tbody.append(`
            <tr data-group="${r.group}" data-status="${r.status}">
                <td><input type="checkbox" class="reader-check"></td>
                <td>${r.stt}</td>
                <td>${r.code}</td>
                <td>
                    <a href="/BanDoc/BanDocChiTiet" class="reader-link">
                        ${r.name}<br>
                        <small><i class="fa fa-envelope"></i> <span class="email"> ${r.email}</span></small><br>
                        <small><i class="fa fa-users"></i> Nhóm: ${r.group}</small>
                    </a>
                </td>
                <td>${r.issueDate}</td>
                <td>${r.expireDate}</td>
                <td><span class="label label-${labelClass}">${r.status}</span></td>
                <td>
                    <button class="btn btn-xs btn-info btn-reader-edit"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-xs btn-danger btn-reader-delete"><i class="fa fa-trash"></i></button>
                    <button class="btn btn-xs btn-warning"><i class="fa fa-clock-rotate-left"></i></button>
                </td>
            </tr>
        `);
        });

        filterAndPaginate(); // Áp dụng tìm kiếm / phân trang
    }
    function renderGroupsTable() {
        const tbody = $('#groupTable tbody');
        tbody.empty();

        groupsData.forEach(group => {
            tbody.append(`
            <tr>
                <td>${group.name}</td>
                <td>${group.maxBooks}</td>
                <td>${group.loanDays}</td>
                <td>${group.renewLimit}</td>
                <td>${group.penalty}</td>
                <td>${group.allowDigital == 1 ? '<i class="fa fa-check text-success"></i>' : ''}</td>
                <td>
                    <button class="btn btn-xs btn-info btn-group-edit"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-xs btn-danger btn-group-delete"><i class="fa fa-trash"></i></button>
                </td>
            </tr>
        `);
            filterAndPaginateGroups();

        });
    }
    // ===== TÌM KIẾM & PHÂN TRANG NHÓM BẠN ĐỌC =====
    let groupCurrentPage = 1;
    const groupRowsPerPage = 5;

    function filterAndPaginateGroups() {
        const keyword = $('#searchGroupInput').val().toLowerCase();
        const rows = $('#groupTable tbody tr');

        // Lọc nhóm theo từ khóa
        const filtered = rows.filter(function () {
            const text = $(this).text().toLowerCase();
            return text.includes(keyword);
        });

        rows.hide();
        const totalRecords = filtered.length;
        const totalPages = Math.ceil(totalRecords / groupRowsPerPage);
        if (groupCurrentPage > totalPages) groupCurrentPage = 1;
        const start = (groupCurrentPage - 1) * groupRowsPerPage;
        const end = start + groupRowsPerPage;
        filtered.slice(start, end).show();

        $('#groupStats').text(`Tổng ${Math.min(end, totalRecords)} / ${totalRecords} nhóm`);
        renderGroupPagination(totalPages);
    }

    function renderGroupPagination(totalPages) {
        const pagination = $('#groupPagination');
        pagination.empty();
        if (totalPages <= 1) return;

        const maxVisible = 3;
        let startPage = Math.max(1, groupCurrentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        if (endPage > totalPages) { endPage = totalPages; startPage = Math.max(1, endPage - maxVisible + 1); }

        if (groupCurrentPage > 1) pagination.append(`<li><a href="#" data-page="1">&laquo;</a></li>`);
        if (startPage > 1) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);

        for (let i = startPage; i <= endPage; i++) {
            pagination.append(`<li class="${i === groupCurrentPage ? 'active' : ''}">
            <a href="#" data-page="${i}">${i}</a>
        </li>`);
        }

        if (endPage < totalPages) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);
        if (groupCurrentPage < totalPages) pagination.append(`<li><a href="#" data-page="${totalPages}">&raquo;</a></li>`);

        pagination.find('a[data-page]').on('click', function (e) {
            e.preventDefault();
            groupCurrentPage = parseInt($(this).data('page'));
            filterAndPaginateGroups();
        });
    }

    // Gọi lại khi nhập tìm kiếm
    $('#searchGroupInput').on('input', function () {
        groupCurrentPage = 1;
        filterAndPaginateGroups();
    });



    // ==========================
    // 🔹 DỮ LIỆU MẪU
    // ==========================
    const overdueData = [
        { card: "BD001", name: "Nguyễn Văn A", borrow: "10/10/2025", due: "20/10/2025", daysLate: 7 },
        { card: "BD002", name: "Trần Thị B", borrow: "05/10/2025", due: "15/10/2025", daysLate: 12 },
        { card: "BD003", name: "Lê Minh C", borrow: "12/10/2025", due: "18/10/2025", daysLate: 9 },
        { card: "BD004", name: "Phạm Thị D", borrow: "03/10/2025", due: "13/10/2025", daysLate: 14 },
        { card: "BD005", name: "Vũ Hồng E", borrow: "08/10/2025", due: "17/10/2025", daysLate: 10 },
        { card: "BD006", name: "Hoàng Văn F", borrow: "07/10/2025", due: "14/10/2025", daysLate: 11 }
    ];

    const circulationData = [
        { code: "SP001", title: "Lập trình JavaScript nâng cao", author: "Nguyễn Văn A", type: "Sách", qty: 3, borrow: "20/10/2025", return: "30/10/2025" },
        { code: "SP002", title: "Tạp chí Khoa học 2025", author: "Đại học ABC", type: "Tạp chí", qty: 1, borrow: "22/10/2025", return: "29/10/2025" },
        { code: "SP003", title: "Machine Learning cơ bản", author: "Phạm Văn B", type: "Sách", qty: 2, borrow: "15/10/2025", return: "25/10/2025" },
        { code: "SP004", title: "Python toàn tập", author: "Trần Thị C", type: "Sách", qty: 4, borrow: "18/10/2025", return: "28/10/2025" },
        { code: "SP005", title: "AI trong đời sống", author: "Vũ Hồng D", type: "Tạp chí", qty: 1, borrow: "19/10/2025", return: "27/10/2025" },
        { code: "SP006", title: "Phân tích dữ liệu với R", author: "Nguyễn Văn F", type: "Sách", qty: 3, borrow: "16/10/2025", return: "26/10/2025" }
    ];

    const activeReadersData = [
        { card: "BD010", name: "Nguyễn Văn C", turns: 15, books: 3 },
        { card: "BD007", name: "Trần Thị D", turns: 12, books: 2 },
        { card: "BD005", name: "Phạm Minh E", turns: 11, books: 4 },
        { card: "BD012", name: "Hoàng Tuấn F", turns: 10, books: 3 },
        { card: "BD002", name: "Lê Văn G", turns: 9, books: 2 },
        { card: "BD001", name: "Nguyễn Hồng H", turns: 8, books: 2 },
        { card: "BD015", name: "Phạm Thị K", turns: 7, books: 1 }
    ];

    // ==========================
    // 🔹 HÀM DÙNG CHUNG
    // ==========================
    function setupTableSearchAndPagination(config) {
        const { searchInput, tableSelector, statsSelector, paginationSelector, rowsPerPage = 5 } = config;
        let currentPage = 1;

        function filterAndPaginate() {
            const keyword = $(searchInput)?.val()?.toLowerCase() || "";
            const rows = $(`${tableSelector} tbody tr`);
            const filtered = rows.filter(function () {
                return $(this).text().toLowerCase().includes(keyword);
            });

            rows.hide();
            const totalRecords = filtered.length;
            const totalPages = Math.ceil(totalRecords / rowsPerPage);
            if (currentPage > totalPages) currentPage = 1;

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            filtered.slice(start, end).show();

            $(statsSelector).text(`Hiển thị ${Math.min(end, totalRecords)} / ${totalRecords} bản ghi`);
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            const pagination = $(paginationSelector);
            pagination.empty();
            if (totalPages <= 1) return;

            const maxVisible = 3;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = startPage + maxVisible - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (currentPage > 1) pagination.append(`<li><a href="#" data-page="1">&laquo;</a></li>`);
            if (startPage > 1) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);

            for (let i = startPage; i <= endPage; i++) {
                pagination.append(`<li class="${i === currentPage ? 'active' : ''}">
        <a href="#" data-page="${i}">${i}</a></li>`);
            }

            if (endPage < totalPages) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);
            if (currentPage < totalPages) pagination.append(`<li><a href="#" data-page="${totalPages}">&raquo;</a></li>`);

            pagination.find('a[data-page]').on('click', function (e) {
                e.preventDefault();
                currentPage = parseInt($(this).data('page'));
                filterAndPaginate();
            });
        }

        if (searchInput)
            $(searchInput).on("input", function () {
                currentPage = 1;
                filterAndPaginate();
            });

        filterAndPaginate();
    }

    // ==========================
    // 🔹 RENDER DỮ LIỆU MẪU
    // ==========================

    // 1️⃣ Quá hạn
    function renderOverdueTable() {
        const tbody = $('#overdueList table tbody');
        tbody.empty();
        overdueData.forEach((r, i) => {
            tbody.append(`
      <tr>
        <td>${i + 1}</td>
        <td>${r.card}</td>
        <td>${r.name}</td>
        <td>${r.borrow}</td>
        <td>${r.due}</td>
        <td>${r.daysLate}</td>
       <td class="text-center">
          <button class="btn btn-sm btn-warning" title="Gửi thông báo">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </td>
      </tr>
    `);
        });
        setupTableSearchAndPagination({
            searchInput: '#searchOverdue',
            tableSelector: '#overdueList table',
            statsSelector: '#overdueTable',
            paginationSelector: '#overduePagination',
            rowsPerPage: 5
        });
    }
    // --- Xử lý nút gửi thông báo trong bảng quá hạn ---
    $(document).on("click", "#overdueList .btn-warning", function () {
        const row = $(this).closest("tr");
        const readerName = row.find("td:nth-child(3)").text();
        const readerCard = row.find("td:nth-child(2)").text();

        // Hiển thị thông báo gửi
        Swal.fire({
            title: "Gửi thông báo?",
            text: `Bạn có chắc muốn gửi thông báo cho ${readerName} (${readerCard}) không?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Gửi ngay",
            cancelButtonText: "Huỷ"
        }).then((result) => {
            if (result.isConfirmed) {
                // Giả lập gửi thành công
                Swal.fire({
                    title: "Đã gửi!",
                    text: `Thông báo đã được gửi tới ${readerName}.`,
                    icon: "success",
                    timer: 1800,
                    showConfirmButton: false
                });

                // Cập nhật trạng thái hàng (ví dụ: đổi màu hoặc thêm biểu tượng ✅)
                $(this)
                    .removeClass("btn-warning")
                    .addClass("btn-success")
                    .attr("disabled", true)
                    .html('<i class="fa-solid fa-check"></i>');
            }
        });
    });

    // 2️⃣ Ấn phẩm lưu thông
    function renderCirculationTable() {
        const tbody = $('#circulationList table tbody');
        tbody.empty();
        circulationData.forEach((r, i) => {
            tbody.append(`
      <tr>
        <td>${i + 1}</td>
        <td>${r.code}</td>
        <td>${r.title}</td>
        <td>${r.author}</td>
        <td>${r.type}</td>
        <td>${r.qty}</td>
        <td>${r.borrow}</td>
        <td>${r.return}</td>
      </tr>
    `);
        });
        setupTableSearchAndPagination({
            searchInput: '#searchCirculation',
            tableSelector: '#circulationList table',
            statsSelector: '#circulationTable',
            paginationSelector: '#circulationPagination',
            rowsPerPage: 5
        });
    }

    // 3️⃣ Bạn đọc tích cực
    function renderActiveReadersTable() {
        const tbody = $('#activeReaders table tbody');
        tbody.empty();
        activeReadersData.forEach((r, i) => {
            tbody.append(`
      <tr>
        <td>${i + 1}</td>
        <td>${r.card}</td>
        <td>${r.name}</td>
        <td>${r.turns}</td>
        <td>${r.books}</td>
      </tr>
    `);
        });
        setupTableSearchAndPagination({
            searchInput: null,
            tableSelector: '#activeReaders table',
            statsSelector: '#activeTable',
            paginationSelector: '#activePagination',
            rowsPerPage: 5
        });
    }
    // Sự kiện khi bấm nút "Cập nhật"
    $(document).on("click", "#refreshActive", function () {
        const topN = parseInt($("#topN").val());
        const timeRange = $("#timeRange").val();

        // Giả lập: sinh ngẫu nhiên lại dữ liệu theo "thời gian"
        let simulatedData = [...activeReadersData]
            .sort(() => Math.random() - 0.5) // trộn ngẫu nhiên
            .slice(0, topN); // lấy top N

        // Giả lập thay đổi dữ liệu theo "khoảng thời gian"
        simulatedData = simulatedData.map((r) => ({
            ...r,
            turns:
                r.turns +
                (timeRange === "month"
                    ? Math.floor(Math.random() * 3)
                    : timeRange === "quarter"
                        ? Math.floor(Math.random() * 6)
                        : Math.floor(Math.random() * 10)),
            books:
                r.books +
                (timeRange === "month"
                    ? Math.floor(Math.random() * 2)
                    : timeRange === "quarter"
                        ? Math.floor(Math.random() * 3)
                        : Math.floor(Math.random() * 4))
        }));

        // Hiển thị loading mô phỏng
        Swal.fire({
            title: "Đang tải dữ liệu...",
            text: "Vui lòng chờ trong giây lát",
            timer: 1200,
            didOpen: () => Swal.showLoading(),
            showConfirmButton: false
        }).then(() => {
            // Render lại bảng
            const tbody = $('#activeReaders table tbody');
            tbody.empty();
            simulatedData.forEach((r, i) => {
                tbody.append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${r.card}</td>
                    <td>${r.name}</td>
                    <td>${r.turns}</td>
                    <td>${r.books}</td>
                </tr>
            `);
            });

            // Cập nhật thống kê hiển thị
            $("#activeTable").text(`Hiển thị ${simulatedData.length} bạn đọc trong ${{
                month: "tháng này",
                quarter: "quý này",
                year: "năm nay"
            }[timeRange]}`);

            Swal.fire({
                icon: "success",
                title: "Đã cập nhật!",
                text: `Hiển thị Top ${topN} bạn đọc tích cực trong ${{
                    month: "tháng này",
                    quarter: "quý này",
                    year: "năm nay"
                }[timeRange]}.`,
                timer: 1800,
                showConfirmButton: false
            });
        });
    });

    // ==========================
    // 🔹 KHỞI TẠO KHI LOAD
    // ==========================
    $(document).ready(function () {
        renderOverdueTable();
        renderCirculationTable();
        renderActiveReadersTable();
    });


    // ============================
    // PHÂN TRANG & TÌM KIẾM DÙNG CHUNG
    // ============================
    function setupTableSearchAndPagination(config) {
        const {
            searchInput,
            tableSelector,
            statsSelector,
            paginationSelector,
            rowsPerPage = 5
        } = config;

        let currentPage = 1;

        function filterAndPaginate() {
            const keyword = $(searchInput).val()?.toLowerCase() || '';
            const rows = $(`${tableSelector} tbody tr`);
            const filtered = rows.filter(function () {
                return $(this).text().toLowerCase().includes(keyword);
            });

            rows.hide();
            const totalRecords = filtered.length;
            const totalPages = Math.ceil(totalRecords / rowsPerPage);
            if (currentPage > totalPages) currentPage = 1;

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            filtered.slice(start, end).show();

            $(statsSelector).text(`Hiển thị ${Math.min(end, totalRecords)} / ${totalRecords} bản ghi`);
            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            const pagination = $(paginationSelector);
            pagination.empty();
            if (totalPages <= 1) return;

            const maxVisible = 3;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = startPage + maxVisible - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (currentPage > 1)
                pagination.append(`<li><a href="#" data-page="1">&laquo;</a></li>`);
            if (startPage > 1)
                pagination.append(`<li class="disabled"><a href="#">...</a></li>`);

            for (let i = startPage; i <= endPage; i++) {
                pagination.append(`<li class="${i === currentPage ? 'active' : ''}">
                <a href="#" data-page="${i}">${i}</a></li>`);
            }

            if (endPage < totalPages)
                pagination.append(`<li class="disabled"><a href="#">...</a></li>`);
            if (currentPage < totalPages)
                pagination.append(`<li><a href="#" data-page="${totalPages}">&raquo;</a></li>`);

            pagination.find('a[data-page]').on('click', function (e) {
                e.preventDefault();
                currentPage = parseInt($(this).data('page'));
                filterAndPaginate();
            });
        }

        // Event khi nhập tìm kiếm
        $(searchInput).on('input', function () {
            currentPage = 1;
            filterAndPaginate();
        });

        // Gọi lần đầu
        filterAndPaginate();
    }

    // ============================
    // KÍCH HOẠT CHO TỪNG BẢNG
    // ============================

    // 1️⃣ DANH SÁCH QUÁ HẠN
    setupTableSearchAndPagination({
        searchInput: '#searchOverdue',
        tableSelector: '#overdueList table',
        statsSelector: '#overdueTable',
        paginationSelector: '#overduePagination',
        rowsPerPage: 5
    });

    // 2️⃣ ẤN PHẨM LƯU THÔNG
    setupTableSearchAndPagination({
        searchInput: '#searchCirculation',
        tableSelector: '#circulationList table',
        statsSelector: '#circulationTable',
        paginationSelector: '#circulationPagination',
        rowsPerPage: 5
    });

    // 3️⃣ BẠN ĐỌC TÍCH CỰC
    setupTableSearchAndPagination({
        searchInput: null, // không có ô tìm kiếm
        tableSelector: '#activeReaders table',
        statsSelector: '#activeTable',
        paginationSelector: '#activePagination',
        rowsPerPage: 5
    });

    $(document).ready(function () {
        renderReadersTable();
        renderGroupsTable();
    });

    // ===== THÊM NHÓM =====
    $(document).on('click', '.btn-add-group', function () {
        currentEditGroupIndex = null;
        $('#groupModalTitle').text('Thêm nhóm bạn đọc');
        $('#groupForm')[0].reset();
        $('#groupModal').modal('show');
    });

    // ===== SỬA NHÓM =====
    $(document).on('click', '.btn-group-edit', function () {
        const row = $(this).closest('tr');
        currentEditGroupIndex = row.index();
        const group = groupsData[currentEditGroupIndex];

        $('#groupModalTitle').text('Sửa nhóm bạn đọc');
        $('#groupName').val(group.name);
        $('#groupBorrowDays').val(group.loanDays);
        $('#groupExtendTimes').val(group.renewLimit);
        $('#groupMaxBooks').val(group.maxBooks);
        $('#groupFine').val(group.penalty);
        $('#groupDigitalAccess').val(group.allowDigital);
        $('#groupModal').modal('show');
    });

    // ===== LƯU NHÓM =====
    $('#btnSaveGroup').on('click', function () {
        const name = $('#groupName').val().trim();
        const maxBooks = $('#groupMaxBooks').val();
        const loanDays = $('#groupBorrowDays').val();
        const renewLimit = $('#groupExtendTimes').val();
        const penalty = $('#groupFine').val();
        const allowDigital = $('#groupDigitalAccess').val();

        if (!name || !maxBooks || !loanDays || !renewLimit || !penalty) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const groupObj = { name, maxBooks, loanDays, renewLimit, penalty, allowDigital };

        if (currentEditGroupIndex === null) {
            // Thêm mới
            groupsData.push(groupObj);
            const newRow = `
                <tr>
                    <td>${name}</td>
                    <td>${maxBooks}</td>
                    <td>${loanDays}</td>
                    <td>${renewLimit}</td>
                    <td>${penalty}</td>
                    <td>${allowDigital == 1 ? '<i class="fa fa-check text-success"></i>' : ''}</td>
                    <td>
                        <button class="btn btn-xs btn-info btn-group-edit"><i class="fa fa-edit"></i></button>
                        <button class="btn btn-xs btn-danger btn-group-delete"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>`;
            $('#groupTable tbody').append(newRow);
        } else {
            // Sửa nhóm
            groupsData[currentEditGroupIndex] = groupObj;
            const row = $('#groupTable tbody tr').eq(currentEditGroupIndex);
            row.html(`
                <td>${name}</td>
                <td>${maxBooks}</td>
                <td>${loanDays}</td>
                <td>${renewLimit}</td>
                <td>${penalty}</td>
                <td>${allowDigital == 1 ? '<i class="fa fa-check text-success"></i>' : ''}</td>
                <td>
                    <button class="btn btn-xs btn-info btn-group-edit"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-xs btn-danger btn-group-delete"><i class="fa fa-trash"></i></button>
                </td>`);
        }

        $('#groupModal').modal('hide');
        alert('✅ Lưu nhóm thành công!');
    });

    // ===== XOÁ NHÓM =====
    $(document).on('click', '.btn-group-delete', function () {
        const row = $(this).closest('tr');
        const groupName = row.find('td:first').text().trim();
        if (confirm(`Bạn có chắc muốn xoá nhóm "${groupName}" không?`)) {
            const index = row.index();
            groupsData.splice(index, 1);
            row.remove();
            alert('🗑️ Đã xoá nhóm bạn đọc!');
        }
    });


    // ===== BẠN ĐỌC =====
    let currentPage = 1;
    const rowsPerPage = 5;
    let currentEditRow = null;
    let currentExtendRow = null;

    // ===== Checkbox chọn tất cả =====
    $('#selectAll').on('click', function () {
        $('.reader-check').prop('checked', $(this).prop('checked'));
        updateActionButtons();
    });

    $(document).on('change', '.reader-check', function () {
        if (!$(this).prop('checked')) $('#selectAll').prop('checked', false);
        updateActionButtons();
    });

    function updateActionButtons() {
        const checkedCount = $('.reader-check:checked').length;
        if (checkedCount > 0) {
            $('#selectedActions').removeClass('hidden');
            $('#selectedCount').text(`Đã chọn ${checkedCount} bạn đọc`);
        } else {
            $('#selectedActions').addClass('hidden');
            $('#selectedCount').text('');
        }
    }

    $(document).on('click', '.btn-clear-selection', function () {
        $('.reader-check, #selectAll').prop('checked', false);
        updateActionButtons();
    });

    // ===== Thêm bạn đọc =====
    $('.btn-add-reader').on('click', function () {
        $('#addReaderModal').modal('show');
    });

    $('#btnSaveReader').on('click', function () {
        const name = $('#readerName').val().trim();
        const email = $('#readerEmail').val().trim();
        const group = $('#readerGroup').val();
        const status = $('#readerStatus').val();
        if (!name || !email) { alert('Vui lòng nhập đầy đủ thông tin!'); return; }

        const lastIndex = $('#readerTable tbody tr').length + 1;
        const readerCode = `BD${String(lastIndex).padStart(3, '0')}`;
        const labelClass = status === 'Hoạt động' ? 'success' :
            (status === 'Sắp hết hạn' ? 'warning' : 'danger');

        const newRow = `
            <tr data-group="${group}" data-status="${status}">
                <td><input type="checkbox" class="reader-check"></td>
                <td>${lastIndex}</td>
                <td>${readerCode}</td>
                <td>
                    <a href="/Reader/ReaderDetail" class="reader-link">
                        ${name}<br>
                        <small><i class="fa fa-envelope"></i> ${email}</small><br>
                        <small><i class="fa fa-users"></i> Nhóm: ${group}</small>
                    </a>
                </td>
                <td>01/01/2025</td>
                <td>01/01/2026</td>
                <td><span class="label label-${labelClass}">${status}</span></td>
                <td>
                    <button class="btn btn-xs btn-info btn-reader-edit"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-xs btn-danger"><i class="fa fa-trash"></i></button>
                    <button class="btn btn-xs btn-warning"><i class="fa fa-clock-rotate-left"></i></button>
                </td>
            </tr>`;
        $('#readerTable tbody').append(newRow);
        $('#addReaderModal').modal('hide');
        $('#addReaderForm')[0].reset();
        filterAndPaginate();
    });

    // ===== Sửa bạn đọc =====
    $(document).on('click', '.btn-reader-edit', function () {
        const row = $(this).closest('tr');
        currentEditRow = row;
        const name = row.find('a.reader-link').contents().first().text().trim();
        const email = row.find('small i.fa-envelope').parent().text().split(' ').pop();
        const group = row.data('group');
        const status = row.data('status');
        $('#editReaderName').val(name);
        $('#editReaderEmail').val(email);
        $('#editReaderGroup').val(group);
        $('#editReaderStatus').val(status);
        $('#editReaderModal').modal('show');
    });

    $('#btnUpdateReader').on('click', function () {
        if (!currentEditRow) return;
        const name = $('#editReaderName').val().trim();
        const email = $('#editReaderEmail').val().trim();
        const group = $('#editReaderGroup').val();
        const status = $('#editReaderStatus').val();
        if (!name || !email) { alert('Vui lòng nhập đầy đủ thông tin!'); return; }
        const labelClass = status === 'Hoạt động' ? 'success' :
            (status === 'Sắp hết hạn' ? 'warning' : 'danger');

        currentEditRow.attr('data-group', group);
        currentEditRow.attr('data-status', status);
        currentEditRow.find('a.reader-link').html(`
            ${name}<br>
            <small><i class="fa fa-envelope"></i> ${email}</small><br>
            <small><i class="fa fa-users"></i> Nhóm: ${group}</small>
        `);
        currentEditRow.find('td:eq(6)').html(`<span class="label label-${labelClass}">${status}</span>`);
        $('#editReaderModal').modal('hide');
        alert('✅ Cập nhật thông tin bạn đọc thành công!');
    });

    // ===== Xoá bạn đọc =====
    $(document).on('click', '#readerTable .btn-reader-delete', function () {
        const row = $(this).closest('tr');
        const name = row.find('a.reader-link').contents().first().text().trim();
        if (confirm(`Bạn có chắc muốn xoá "${name}" không?`)) {
            row.remove();
            alert('🗑️ Đã xoá bạn đọc!');
            filterAndPaginate();
        }
    });

    $('.btn-delete-selected').on('click', function () {
        const selected = $('.reader-check:checked');
        if (selected.length === 0) { alert('⚠️ Vui lòng chọn ít nhất một bạn đọc để xoá!'); return; }
        if (!confirm(`Bạn có chắc muốn xoá ${selected.length} bạn đọc đã chọn không?`)) return;

        selected.each(function () { $(this).closest('tr').remove(); });
        $('#selectAll').prop('checked', false);
        updateActionButtons();
        filterAndPaginate();
        alert(`🗑️ Đã xoá ${selected.length} bạn đọc!`);
    });

    // ===== Gia hạn thẻ =====
    $(document).on('click', '.btn-extend-card', function () {
        currentExtendRow = $(this).closest('tr');
        const currentExpire = currentExtendRow.find('td:eq(5)').text().trim();
        $('#currentExpireDate').val(currentExpire);
        $('#newExpireDate').val('');
        $('#extendCardModal').modal({ backdrop: 'static', keyboard: false });
    });

    $('#btnConfirmExtend').on('click', function () {
        const newDate = $('#newExpireDate').val();
        const oldDate = $('#currentExpireDate').val();
        if (!newDate) return alert('Vui lòng chọn ngày hết hạn mới!');
        if (compareDates(newDate, oldDate) <= 0) return alert('⚠️ Ngày hết hạn mới phải lớn hơn ngày hiện tại!');
        if (currentExtendRow) {
            currentExtendRow.find('td:eq(5)').text(formatDate(newDate));
        }
        $('#extendCardModal').modal('hide');
        setTimeout(() => { $('.modal-backdrop').remove(); $('body').removeClass('modal-open').css('padding-right', ''); }, 300);
        alert(`⏰ Gia hạn thành công! Ngày hết hạn mới: ${formatDate(newDate)}`);
    });

    // ===== Modal in thẻ =====
    $(document).on('click', '.btn-print-selected', function () {
        const selectedRows = $('.reader-check:checked').closest('tr');
        if (!selectedRows.length) { alert('Vui lòng chọn ít nhất 1 bạn đọc để in thẻ.'); return; }

        let html = '';
        selectedRows.each(function () {
            const name = $(this).find('.reader-link').contents().first().text().trim();
            const code = $(this).find('td:nth-child(3)').text();
            const group = $(this).data('group');
            const issueDate = $(this).find('td:nth-child(5)').text();
            const expiryDate = $(this).find('td:nth-child(6)').text();

            html += `
                <div class="print-card" style="border:1px solid #ccc; border-radius:8px; padding:15px; margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="margin:0 0 5px 0;">${name}</h4>
                            <p style="margin:0;"><strong>Mã thẻ:</strong> ${code}</p>
                            <p style="margin:0;"><strong>Nhóm:</strong> ${group}</p>
                            <p style="margin:0;"><strong>Đơn vị trực thuộc:</strong> Khoa Công nghệ thông tin</p>
                            <p style="margin:0;"><strong>Ngày cấp:</strong> ${issueDate} — <strong>Hết hạn:</strong> ${expiryDate}</p>
                        </div>
                        <div style="text-align:center;">
                            <img src="https://barcodeapi.org/api/128/${code}" alt="Barcode" style="height:40px;">
                            <div style="font-size:12px; margin-top:3px;">${code}</div>
                        </div>
                    </div>
                </div>`;
        });

        $('#printArea').html(html);
        $('#printCardModal').modal('show');
    });

    $(document).on('click', '#btnPrint', function () {
        const printContent = document.getElementById('printArea').innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>In thẻ bạn đọc</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
                    .print-card { border: 1px solid #ccc; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
                    img { height: 40px; }
                </style>
            </head>
            <body>
                ${printContent}
                <scr` + `ipt>window.onload=function(){window.print();window.close();}</scr` + `ipt>
            </body></html>`);
        printWindow.document.close();
    });

    // ===== HỖ TRỢ =====
    function compareDates(newDateStr, oldDateStr) {
        function normalize(dateStr) {
            if (dateStr.includes('/')) {
                const [d, m, y] = dateStr.split('/');
                return `${y}-${m}-${d}`;
            }
            return dateStr;
        }
        return new Date(normalize(newDateStr)) - new Date(normalize(oldDateStr));
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    function filterAndPaginate() {
        const keyword = $('#searchInput').val().toLowerCase();
        const group = $('#filterGroup').val();
        const status = $('#filterStatus').val();
        const rows = $('#readerTable tbody tr');
        let filtered = rows.filter(function () {
            const text = $(this).text().toLowerCase();
            const matchKeyword = text.includes(keyword);
            const matchGroup = !group || $(this).data('group') === group;
            const matchStatus = !status || $(this).data('status') === status;
            return matchKeyword && matchGroup && matchStatus;
        });

        rows.hide();
        const totalRecords = filtered.length;
        const totalPages = Math.ceil(totalRecords / rowsPerPage);
        if (currentPage > totalPages) currentPage = 1;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        filtered.slice(start, end).show();

        $('#recordStats').text(`Tổng ${Math.min(end, totalRecords)} / ${totalRecords} bản ghi`);
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const pagination = $('#pagination');
        pagination.empty();
        if (totalPages <= 1) return;
        const maxVisible = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        if (endPage > totalPages) { endPage = totalPages; startPage = Math.max(1, endPage - maxVisible + 1); }
        if (currentPage > 1) pagination.append(`<li><a href="#" data-page="1">&laquo;</a></li>`);
        if (startPage > 1) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);
        for (let i = startPage; i <= endPage; i++)
            pagination.append(`<li class="${i === currentPage ? 'active' : ''}"><a href="#" data-page="${i}">${i}</a></li>`);
        if (endPage < totalPages) pagination.append(`<li class="disabled"><a href="#">...</a></li>`);
        if (currentPage < totalPages) pagination.append(`<li><a href="#" data-page="${totalPages}">&raquo;</a></li>`);

        pagination.find('a[data-page]').on('click', function (e) {
            e.preventDefault();
            currentPage = parseInt($(this).data('page'));
            filterAndPaginate();
        });
    }

    $('#searchInput, #filterGroup, #filterStatus').on('input change', function () { currentPage = 1; filterAndPaginate(); });

    $('#btnPolicyInfo').on('click', function () { $('#policyInfoModal').modal('show'); });

    filterAndPaginate();


    // Biểu đồ cột
    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Học sinh', 'Sinh viên', 'Giảng viên', 'Khác'],
            datasets: [{
                label: 'Số lượng bạn đọc',
                data: [120, 200, 80, 20],
                backgroundColor: ['#4a90e2', '#2ecc71', '#f39c12', '#9b59b6']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Số lượng bạn đọc' } },
                x: { title: { display: true, text: 'Nhóm bạn đọc' } }
            }
        }
    });

    // Biểu đồ trend / timeline
    const ctx2 = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
            datasets: [{
                label: 'Tổng bạn đọc',
                data: [300, 320, 350, 360, 380, 420],
                fill: true,
                backgroundColor: 'rgba(52,152,219,0.2)',
                borderColor: '#3498db',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Số lượng' } },
                x: { title: { display: true, text: 'Tháng' } }
            }
        }
    });

    const ctx3 = document.getElementById('activeReadersChart').getContext('2d');
    let activeChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['Nguyễn Văn C', 'Trần Thị D', 'Lê Thị E'], // tên bạn đọc
            datasets: [{
                label: 'Số lượt mượn',
                data: [15, 12, 10],
                backgroundColor: '#f39c12'
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });


    // Update giá trị range age
    const ageRange = document.getElementById('ageRange');
    const ageValue = document.getElementById('ageValue');
    ageRange.addEventListener('input', function () {
        ageValue.textContent = this.value + '+';
    });



});
