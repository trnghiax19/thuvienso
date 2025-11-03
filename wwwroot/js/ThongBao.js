/* =========================
           Notification Dashboard JS
           - LocalStorage persistence
           - CRUD, Filters, Pagination
           - Charts update
           - Config modal
           ========================= */

(function () {
    // ---------- default data (sample)
    const DEFAULT = [
        { id: 1, title: "Nhắc hạn thanh toán", message: "Hạn thanh toán hóa đơn ngày 30/10", channel: "Email", user: "system", time: "2025-10-20 08:00", status: "Đã gửi", attempts: 1, important: false },
        { id: 2, title: "Xác nhận đăng ký", message: "Mã OTP 123456", channel: "SMS", user: "system", time: "2025-10-21 09:12", status: "Đã gửi", attempts: 1, important: true },
        { id: 3, title: "Nhắc lịch họp", message: "Cuộc họp dự án lúc 15:00", channel: "Push", user: "admin", time: "2025-10-22 13:00", status: "Đang chờ", attempts: 0, important: false },
        { id: 4, title: "Thông báo nghỉ lễ", message: "Trường nghỉ Tết...", channel: "Email", user: "admin", time: "2025-10-01 07:00", status: "Đã gửi", attempts: 1, important: false },
        { id: 5, title: "Cảnh báo bảo mật", message: "Phát hiện đăng nhập bất thường", channel: "OTT", user: "security", time: "2025-10-24 11:00", status: "Lỗi", attempts: 2, important: true },
        { id: 6, title: "Chương trình khuyến mãi", message: "Giảm giá 20% hôm nay", channel: "Push", user: "marketing", time: "2025-10-25 10:00", status: "Đã gửi", attempts: 1, important: false },
        { id: 7, title: "Reset mật khẩu", message: "Yêu cầu reset mật khẩu từ user abc", channel: "Email", user: "system", time: "2025-10-26 08:30", status: "Đang chờ", attempts: 0, important: false },
        { id: 8, title: "Thông báo bảo trì", message: "Hệ thống bảo trì 02:00 - 03:00", channel: "Email", user: "ops", time: "2025-10-27 01:50", status: "Đang chờ", attempts: 0, important: false }
    ];

    // ---------- state & config
    const LS_KEY = 'notify_demo_data_v1';
    const LS_CFG = 'notify_demo_cfg_v1';
    let DATA = loadData();
    let CONFIG = loadConfig();

    let state = {
        page: 1,
        perPage: 5,
        filterKey: '',
        filterChannel: '',
        filterStatus: '',
        isAdmin: false
    };

    // ---------- cache DOM
    const $tbody = $('#notification-table tbody');
    const $pagination = $('#pagination');
    const $filterKey = $('#filter-key');
    const $filterChannel = $('#filter-channel');
    const $filterStatus = $('#filter-status');
    const $chkAdmin = $('#chk-admin');

    // charts
    let chartLine = null;
    let chartDoughnut = null;

    // ---------- util
    function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(DATA)); }
    function saveConfig() { localStorage.setItem(LS_CFG, JSON.stringify(CONFIG)); }
    function loadData() {
        const v = localStorage.getItem(LS_KEY);
        if (v) {
            try { return JSON.parse(v); } catch (e) { console.warn('corrupt LS data'); }
        }
        // clone default
        return DEFAULT.map(x => Object.assign({}, x));
    }
    function loadConfig() {
        const v = localStorage.getItem(LS_CFG);
        if (v) {
            try { return JSON.parse(v); } catch (e) { }
        }
        // default config
        return { sendDelay: 800, retryCount: 2, enableLogging: true };
    }
    function nowstr() { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
    function pad(n) { return n < 10 ? '0' + n : n; }
    function toast(msg, type = 'success', timeout = 3500) {
        const id = 't' + Date.now();
        const el = $('<div class="alert alert-' + (type === 'error' ? 'danger' : type) + ' alert-dismissible" id="' + id + '">' +
            '<button type="button" class="close" data-dismiss="alert">&times;</button>' + msg + '</div>');
        $('#toast-area').append(el);
        setTimeout(() => el.fadeOut(300, () => el.remove()), timeout);
    }

    // ---------- rendering table & pagination
    function applyFilters(data) {
        return data.filter(item => {
            if (state.filterKey && !item.title.toLowerCase().includes(state.filterKey.toLowerCase())) return false;
            if (state.filterChannel && item.channel !== state.filterChannel) return false;
            if (state.filterStatus && item.status !== state.filterStatus) return false;
            return true;
        });
    }

    function renderTable() {
        const filtered = applyFilters(DATA);
        const total = filtered.length;
        const pages = Math.max(1, Math.ceil(total / state.perPage));
        if (state.page > pages) state.page = pages;

        const start = (state.page - 1) * state.perPage;
        const slice = filtered.slice(start, start + state.perPage);

        $tbody.empty();
        slice.forEach(item => {
            const labelClass = item.status === 'Đã gửi' ? 'label-success' : (item.status === 'Đang chờ' ? 'label-warning' : 'label-danger');
            const row = $('<tr></tr>');
            const titleCell = $('<td style="vertical-align:middle;"></td>').append($('<strong></strong>').text(item.title + (item.important ? ' 🔴' : '')));
            row.append(titleCell);
            row.append($('<td style="vertical-align:middle;"></td>').text(item.channel));
            row.append($('<td style="vertical-align:middle;"></td>').text(item.user));
            row.append($('<td style="vertical-align:middle;"></td>').text(item.time));
            row.append($('<td style="vertical-align:middle;"></td>').html('<span class="label label-status ' + labelClass + '">' + item.status + '</span>'));

            // actions & permissions
            const $act = $('<td class="text-center" style="vertical-align:middle;"></td>');
            // view
            $act.append($('<button class="btn btn-xs btn-info btn-view" title="Xem"><i class="glyphicon glyphicon-eye-open"></i></button>').data('id', item.id));
            // simulate retry
            $act.append(' ');
            $act.append($('<button class="btn btn-xs btn-primary btn-send" title="Gửi thử"><i class="glyphicon glyphicon-send"></i></button>').data('id', item.id));
            // edit/delete only for admin
            if (state.isAdmin) {
                $act.append(' ');
                $act.append($('<button class="btn btn-xs btn-warning btn-edit" title="Sửa"><i class="glyphicon glyphicon-pencil"></i></button>').data('id', item.id));
                $act.append(' ');
                $act.append($('<button class="btn btn-xs btn-danger btn-delete" title="Xóa"><i class="glyphicon glyphicon-trash"></i></button>').data('id', item.id));
            }
            row.append($act);
            $tbody.append(row);
        });

        // pagination
        renderPagination(total, pages);

        // stats & charts
        updateStats();
        updateCharts();
    }

    function renderPagination(totalItems, totalPages) {
        $pagination.empty();
        if (totalPages <= 1) return;
        // prev
        const prev = $('<li></li>').append($('<a href="#">&laquo;</a>'));
        if (state.page === 1) prev.addClass('disabled');
        else prev.on('click', e => { e.preventDefault(); state.page--; renderTable(); });
        $pagination.append(prev);

        // pages (show limited range)
        const maxShow = 7;
        let start = Math.max(1, state.page - Math.floor(maxShow / 2));
        let end = Math.min(totalPages, start + maxShow - 1);
        if (end - start < maxShow - 1) start = Math.max(1, end - maxShow + 1);
        for (let i = start; i <= end; i++) {
            const li = $('<li><a href="#">' + i + '</a></li>');
            if (i === state.page) li.addClass('active');
            else li.on('click', (e) => { e.preventDefault(); state.page = i; renderTable(); });
            $pagination.append(li);
        }

        // next
        const next = $('<li></li>').append($('<a href="#">&raquo;</a>'));
        if (state.page === totalPages) next.addClass('disabled');
        else next.on('click', e => { e.preventDefault(); state.page++; renderTable(); });
        $pagination.append(next);
    }

    // ---------- CRUD handlers
    function openCreate() {
        $('#modalCreateTitle').text('Tạo thông báo mới');
        $('#formCreateEdit')[0].reset();
        $('#formCreateEdit [name=id]').val('');
        $('#modalCreateEdit').modal('show');
    }

    function openEdit(id) {
        const it = DATA.find(x => x.id === id); if (!it) return;
        $('#modalCreateTitle').text('Sửa thông báo');
        $('#formCreateEdit [name=id]').val(it.id);
        $('#formCreateEdit [name=title]').val(it.title);
        $('#formCreateEdit [name=message]').val(it.message);
        $('#formCreateEdit [name=channel]').val(it.channel);
        $('#formCreateEdit [name=simulateSend]').prop('checked', false);
        $('#formCreateEdit [name=important]').prop('checked', !!it.important);
        $('#modalCreateEdit').modal('show');
    }

    function openView(id) {
        const it = DATA.find(x => x.id === id); if (!it) return;
        $('#view-title').text(it.title);
        $('#view-message').text(it.message);
        $('#view-channel').text(it.channel);
        $('#view-user').text(it.user);
        $('#view-time').text(it.time);
        $('#view-status').html('<span class="label label-' + (it.status === 'Đã gửi' ? 'success' : (it.status === 'Đang chờ' ? 'warning' : 'danger')) + '">' + it.status + '</span>');
        $('#modalView').modal('show');
    }

    let pendingDeleteId = null;
    function openDelete(id) {
        const it = DATA.find(x => x.id === id); if (!it) return;
        pendingDeleteId = id;
        $('#delete-title').text(it.title);
        $('#modalDelete').modal('show');
    }
    function confirmDelete() {
        if (!pendingDeleteId) return;
        DATA = DATA.filter(x => x.id !== pendingDeleteId);
        saveData();
        pendingDeleteId = null;
        $('#modalDelete').modal('hide');
        toast('Xóa thành công', 'success');
        renderTable();
    }

    // ---------- simulate send + retry logic
    function simulateSend(id) {
        const it = DATA.find(x => x.id === id); if (!it) return;
        // if already sent, show toast
        if (it.status === 'Đã gửi') { toast('Đã gửi trước đó'); return; }
        // try to send: simulate random success/fail
        it.status = 'Đang chờ';
        saveData(); renderTable();

        // simulate async with config.sendDelay
        const delay = Number(CONFIG.sendDelay || 800);
        const maxRetry = Number(CONFIG.retryCount || 2);
        let tries = it.attempts || 0;

        function attempt() {
            tries++;
            // small random outcome (70% success)
            const success = Math.random() < 0.7;
            setTimeout(() => {
                if (success) {
                    it.status = 'Đã gửi';
                    it.attempts = tries;
                    it.time = nowstr();
                    if (CONFIG.enableLogging) console.log(`[send] id=${it.id} ok after ${tries} try`);
                    saveData();
                    toast('Gửi thành công: ' + it.title, 'success');
                    renderTable();
                } else {
                    if (tries <= maxRetry) {
                        if (CONFIG.enableLogging) console.log(`[send] id=${it.id} failed try ${tries}, retrying...`);
                        attempt();
                    } else {
                        it.status = 'Lỗi';
                        it.attempts = tries;
                        if (CONFIG.enableLogging) console.log(`[send] id=${it.id} failed after ${tries}`);
                        saveData();
                        toast('Gửi thất bại: ' + it.title, 'error');
                        renderTable();
                    }
                }
            }, delay);
        }
        attempt();
    }

    // ---------- stats & charts
    function updateStats() {
        $('#stat-total').text(DATA.length);
        $('#stat-sent').text(DATA.filter(x => x.status === 'Đã gửi').length);
        $('#stat-pending').text(DATA.filter(x => x.status === 'Đang chờ').length);
        $('#stat-error').text(DATA.filter(x => x.status === 'Lỗi').length);
    }

    function updateCharts() {
        // line chart: count per day (last 7 days) by created time (we'll use time field date part if present)
        const labels = [];
        const counts = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
            labels.push(key);
            const c = DATA.reduce((s, it) => {
                const itDate = it.time ? it.time.split(' ')[0] : '';
                return s + (itDate === key ? 1 : 0);
            }, 0);
            counts.push(c);
        }
        if (!chartLine) {
            const ctx = document.getElementById('chart-line').getContext('2d');
            chartLine = new Chart(ctx, {
                type: 'line',
                data: { labels: labels, datasets: [{ label: 'Số thông báo', data: counts, backgroundColor: 'rgba(51,122,183,0.15)', borderColor: '#337ab7', fill: true }] },
                options: { responsive: true, legend: { display: false } }
            });
        } else {
            chartLine.data.labels = labels; chartLine.data.datasets[0].data = counts; chartLine.update();
        }

        // doughnut: channel distribution
        const channels = ['Email', 'SMS', 'Push', 'OTT', 'Webhook'];
        const values = channels.map(ch => DATA.filter(x => x.channel === ch).length);
        if (!chartDoughnut) {
            const ctx2 = document.getElementById('chart-doughnut').getContext('2d');
            chartDoughnut = new Chart(ctx2, {
                type: 'doughnut',
                data: { labels: channels, datasets: [{ data: values, backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#FF6384', '#9b59b6'] }] },
                options: { responsive: true, legend: { position: 'bottom' } }
            });
        } else {
            chartDoughnut.data.datasets[0].data = values; chartDoughnut.update();
        }
    }

    // ---------- config handlers
    function openConfig() {
        // fill values
        $('#formConfig [name=sendDelay]').val(CONFIG.sendDelay);
        $('#formConfig [name=retryCount]').val(CONFIG.retryCount);
        $('#formConfig [name=enableLogging]').prop('checked', !!CONFIG.enableLogging);
        $('#modalConfig').modal('show');
    }

    // --- 1. User Preferences ---
    if (!CONFIG.userPrefs) CONFIG.userPrefs = {
        defaultChannels: ['Email', 'Push'],
        receiveImportantOnly: false,
        users: ['system', 'admin', 'marketing', 'security', 'ops']
    };

    // --- 2. Security & Compliance ---
    if (!CONFIG.security) CONFIG.security = {
        enableEncryption: true,
        enable2FA: false,
        auditLogEnabled: true
    };

    // --- 3. Audit Log ---
    const LS_AUDIT = 'notify_audit_v1';
    function logAudit(action, detail) {
        if (!CONFIG.security.auditLogEnabled) return;
        const logs = JSON.parse(localStorage.getItem(LS_AUDIT) || '[]');
        logs.unshift({
            time: nowstr(),
            action: action,
            user: state.isAdmin ? 'admin' : 'user',
            detail: detail
        });
        localStorage.setItem(LS_AUDIT, JSON.stringify(logs.slice(0, 100)));
    }

    // --- 4. Scheduling ---
    function simulateSchedule(item) {
        if (!item.scheduleTime) return;
        const now = new Date();
        const target = new Date(item.scheduleTime);
        if (target > now) {
            const diff = target.getTime() - now.getTime();
            toast(`⏰ Đã lên lịch gửi "${item.title}" sau ${Math.round(diff / 1000)}s`, 'info');
            setTimeout(() => simulateSend(item.id), diff);
        }
    }

   // ---------- Report Panel ----------
    function renderReportPanel() {
        const $wrap = $('#report-panel');
        if (!$wrap.length) return;

        const html = `
    <div class="panel panel-info panel-advanced">
        <div class="panel-heading"><i class="glyphicon glyphicon-stats"></i> Báo cáo & Giám sát chi tiết</div>
        <div class="panel-body">
            <div class="form-inline" style="margin-bottom:10px;">
                <select class="form-control input-sm" id="report-period">
                    <option value="7">7 ngày</option>
                    <option value="30">30 ngày</option>
                    <option value="custom">Tùy chỉnh</option>
                </select>
                <button class="btn btn-default btn-sm" id="btn-refresh-report"><i class="glyphicon glyphicon-refresh"></i> Làm mới</button>
                <button class="btn btn-default btn-sm" id="btn-export-csv"><i class="glyphicon glyphicon-download-alt"></i> Xuất CSV</button>
            </div>
            <table class="table table-condensed table-striped small" id="report-table">
                <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Sự kiện</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>27/10 08:30</td><td>Gửi Email test</td><td><span class="label label-success">Thành công</span></td></tr>
                    <tr><td>27/10 08:31</td><td>Gửi SMS lỗi</td><td><span class="label label-danger">Thất bại</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>`;

        $wrap.html(html);

        // Bind nút refresh
        $('#btn-refresh-report').on('click', () => {
            toast('Báo cáo đã được làm mới', 'info');
            // TODO: cập nhật bảng từ DATA nếu muốn động
        });

        // Bind nút export CSV
        $('#btn-export-csv').on('click', () => {
            exportReportCSV();
        });
    }

    // Hàm xuất CSV mẫu
    function exportReportCSV() {
        const rows = [];
        $('#report-table tbody tr').each(function () {
            const cols = $(this).find('td').map((i, td) => $(td).text().trim()).get();
            rows.push(cols.join(','));
        });
        const csv = 'Thời gian,Sự kiện,Trạng thái\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- hook audit logging into CRUD actions ---
    const _saveData = saveData;
    saveData = function () {
        _saveData();
        logAudit('saveData', 'Cập nhật dữ liệu thông báo');
    };
    const _confirmDelete = confirmDelete;
    confirmDelete = function () {
        logAudit('delete', 'Xóa thông báo ID=' + pendingDeleteId);
        _confirmDelete();
    };

    // --- schedule hook ---
    const _createEditSubmit = $('#formCreateEdit').off('submit').on('submit', function (e) {
        e.preventDefault();
        const form = $(this);
        const data = {};
        form.serializeArray().forEach(i => data[i.name] = i.value);
        const simulate = !!form.find('[name=simulateSend]').is(':checked');
        const important = !!form.find('[name=important]').is(':checked');
        const scheduleTime = form.find('[name=scheduleTime]').val() || '';

        const id = data.id ? Number(data.id) : (DATA.length ? Math.max(...DATA.map(x => x.id)) + 1 : 1);
        const obj = {
            id, title: data.title, message: data.message, channel: data.channel,
            user: 'admin', time: nowstr(), status: simulate ? 'Đang chờ' : 'Đã gửi',
            attempts: simulate ? 0 : 1, important, scheduleTime
        };
        const idx = DATA.findIndex(x => x.id === id);
        if (idx >= 0) DATA[idx] = obj; else DATA.unshift(obj);
        saveData();
        $('#modalCreateEdit').modal('hide');
        renderTable();
        if (simulate) simulateSend(id);
        else if (scheduleTime) simulateSchedule(obj);
        logAudit('create/edit', `Thông báo "${obj.title}"`);
    });

    // --- render extra panel after table ---
    $(document).ready(() => {
        $('<div id="report-panel"  style="margin-top:10px;"></div>').insertAfter('.panel.panel-default:last');
        renderReportPanel();
    });
    // ---------- event bindings ----------
    function bind() {
        // open create
        $('#btn-open-create').on('click', openCreate);
        $('#btn-open-config').on('click', openConfig);

        // admin toggle
        $chkAdmin.on('change', function () {
            state.isAdmin = this.checked;
            // re-render table to show/hide edit/delete
            state.page = 1;
            renderTable();
        });

        // form submit for create/edit
        $('#formCreateEdit').on('submit', function (e) {
            e.preventDefault();
            const form = $(this);
            const data = {};
            form.serializeArray().forEach(i => data[i.name] = i.value);
            const simulate = !!form.find('[name=simulateSend]').is(':checked');
            const important = !!form.find('[name=important]').is(':checked');

            const id = data.id ? Number(data.id) : (DATA.length ? Math.max(...DATA.map(x => x.id)) + 1 : 1);
            const now = nowstr();
            const obj = {
                id: id,
                title: data.title,
                message: data.message,
                channel: data.channel,
                user: 'admin',
                time: now,
                status: simulate ? 'Đang chờ' : 'Đã gửi',
                attempts: simulate ? 0 : 1,
                important: important
            };

            const existingIndex = DATA.findIndex(x => x.id === id);
            if (existingIndex >= 0) {
                DATA[existingIndex] = obj;
                toast('Cập nhật thông báo thành công', 'success');
            } else {
                DATA.unshift(obj); // add to top
                toast('Tạo thông báo mới', 'success');
            }
            saveData();
            $('#modalCreateEdit').modal('hide');
            renderTable();

            // if simulateSend => auto call simulateSend to try sending
            if (simulate) {
                setTimeout(() => simulateSend(id), 200);
            }
        });

        // table delegates: view, send, edit, delete
        $tbody.on('click', '.btn-view', function () { const id = $(this).data('id'); openView(id); });
        $tbody.on('click', '.btn-send', function () { const id = $(this).data('id'); simulateSend(id); });
        $tbody.on('click', '.btn-edit', function () { const id = $(this).data('id'); openEdit(id); });
        $tbody.on('click', '.btn-delete', function () { const id = $(this).data('id'); openDelete(id); });

        $('#btn-confirm-delete').on('click', confirmDelete);

        // filters
        $filterKey.on('input', function () { state.filterKey = $(this).val(); state.page = 1; renderTable(); });
        $filterChannel.on('change', function () { state.filterChannel = $(this).val(); state.page = 1; renderTable(); });
        $filterStatus.on('change', function () { state.filterStatus = $(this).val(); state.page = 1; renderTable(); });
        $('#btn-filter-reset').on('click', function () { $filterKey.val(''); $filterChannel.val(''); $filterStatus.val(''); state.filterKey = ''; state.filterChannel = ''; state.filterStatus = ''; renderTable(); });

        // config save
        $('#formConfig').on('submit', function (e) {
            e.preventDefault();
            const f = $(this);
            CONFIG.sendDelay = Number(f.find('[name=sendDelay]').val());
            CONFIG.retryCount = Number(f.find('[name=retryCount]').val());
            CONFIG.enableLogging = !!f.find('[name=enableLogging]').is(':checked');
            saveConfig();
            $('#modalConfig').modal('hide');
            toast('Lưu cấu hình hệ thống', 'success');
        });

        // per page change (if want)
        // optionally exposed UI to change perPage
    }

    // ---------- init ----------
    function init() {
        bind();
        renderTable();
        updateCharts();
        // keep charts real time on window focus sometimes
        window.addEventListener('focus', updateCharts);
    }

    init();

})(); // IIFE

function simulateSchedule(item) {
    if (!item.scheduleTime) return;
    const now = new Date();
    const target = new Date(item.scheduleTime);
    if (target > now) {
        const diff = target.getTime() - now.getTime();
        toast(`⏰ Đã lên lịch gửi "${item.title}" sau ${Math.round(diff / 1000)}s`, 'info');
        setTimeout(() => simulateSend(item.id), diff);
    } else {
        // nếu thời gian đã qua, gửi ngay
        simulateSend(item.id);
    }
}

