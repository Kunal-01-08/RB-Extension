

chrome.runtime.onMessage.addListener(
  (message,sender, sendResponse) => {
    if (message.type === "Check_login_status") {
    checkLogin().then((isLoggedIn)=>sendResponse({loggedIn:isLoggedIn}))
    return true;
    }
    if(message.type==="Replace_the_alias"){
        getData(message.data).then((data)=>sendResponse(data))
        return true; 
    }
  }
)



async function getData(alias) {
     try{
        let res=await fetch("http://rapid-buffer.vercel.app/api/alias",{
            method:"GET",
            headers:{
                "givenAlias":alias,
                 "x-requesting-agent":"RBS"
            }
        })

        let data=await res.json()
        return data;
    }
    catch (err) {
    console.error("Network error", err);
  }
}


async function checkLogin(){
    try{
        let res=await fetch("http://rapid-buffer.vercel.app/api/me",{
            method:"GET",
            headers:{
                 "x-requesting-agent":"RBS"
            }
        })

        let data=await res.json()

        if(data.loggedIn){
            return true;
        }
        else {
            return false
        }
    }
    catch (err) {
    console.error("Network error", err);
  }
}

