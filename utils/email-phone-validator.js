function validateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

function validatePhone(phone)  
{
  if (/^\+(?:[0-9] ?){6,14}[0-9]$/.test(phone) || (/^\d{10}$/.test(phone)))
  {
    return (true)
  }
    return (false)
}

module.exports = {validateEmail, validatePhone}