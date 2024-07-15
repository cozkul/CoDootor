export default async function GetUser({ sessionInfo }) {
    const user_id = sessionInfo.user.sub.split("|")[1];

    // Get the user data for the user id of the current logged-in user
    let userData = await fetch(`http://host.docker.internal:5001/user/${user_id}`)
    .then(res => {
      if (res.ok) return res.json();
      else return null;
    });
  
    // If user doesn't already exist, then we use the POST endpoint to create a new one
    if (!userData) {
      const data = {
        "user_id": user_id,
        "nickname": sessionInfo.user.nickname
      }
  
      userData = await fetch(`http://host.docker.internal:5001/user/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": 'application/json'
        }
      }).then(resp => resp.json());
    }

    return userData;
}