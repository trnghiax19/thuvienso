using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class BanDocController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult BanDocChiTiet()
        {
            return View();
        }
    }
}
