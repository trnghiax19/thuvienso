using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class MuonTraController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GiuCho()
        {
            return View();
        }
    }
}
