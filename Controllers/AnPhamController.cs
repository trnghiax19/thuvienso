using Microsoft.AspNetCore.Mvc;

namespace ThuVienSo.Controllers
{
    public class AnPhamController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
