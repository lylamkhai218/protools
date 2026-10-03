	function Checkinfo()
		{
			Name=document.Reservation.Name.value
			Email=document.Reservation.Email.value
			
			if(!Name)
			{
				alert("Please enter your name !")
				document.Reservation.Name.focus()
				return false;
			}
			if(!Email)
			{
				alert("Please enter your email !")
				document.Reservation.Email.focus()
				return false;
			}
			re=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
			if (re.test(Email)==false)
			{
				alert("email error !")
				document.Reservation.Email.focus()
				return false;
			}	
		}
		
function contact()
		{
			Name=document.Contact.Name.value
			Email=document.Contact.Email.value
			Sub=document.Contact.Title.value
			Messager=document.Contact.Message.value
			if(!Name)
			{
				alert("Please enter your name !")
				document.Contact.Name.focus()
				return false;
			}
			if(!Email)
			{
				alert("Please enter your email !")
				document.Contact.Email.focus()
				return false;
			}
			re=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
			if (re.test(Email)==false)
			{
				alert("email error !")
				document.Contact.Email.focus()
				return false;
			}	
			if(!Sub)
			{
				alert("Please enter subject !")
				document.Contact.Title.focus()
				return false;
			}
			if(!Messager)
			{
				alert("Please enter your message !")
				document.Contact.Message.focus()
				return false;
			}
		}