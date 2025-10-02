using adress_book_back.Interfaces;
using adress_book_back.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace adress_book_back.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdressesController : ControllerBase
    {
        private readonly IAdressService _addressService;

        public AdressesController(IAdressService dressService)
        {
            _addressService = dressService;
        }

        // GET: api/Addresses/GetAdresses?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetAdresses(int page = 1, int pageSize = 10)
        {
            var result = await _addressService.GetAdresses(page, pageSize);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // GET: api/Addresses/GetAllAddresses
        [HttpGet]
        public async Task<IActionResult> GetAllAddresses()
        {
            var result = await _addressService.GetAllAddresses();
            return Ok(JsonConvert.SerializeObject(result));
        }

        // POST: api/Addresses/Save
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] Adress address)
        {
            if (address == null)
                return BadRequest("Invalid address data.");

            var result = await _addressService.Save(address);
            return Ok(JsonConvert.SerializeObject(result));
        }

        // DELETE: api/Addresses/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _addressService.Delete(id);
            return Ok(JsonConvert.SerializeObject(success));
        }
    }
}
