using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class TaiKhoanController : Controller
    {
        public IActionResult DangNhap()
        {
            return View();
        }
        public IActionResult DangKy()
        {
            return View();
        }
    }
}
