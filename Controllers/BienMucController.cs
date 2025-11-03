using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class BienMucController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult TuDien()
        {
            return View();
        }
    }
}
