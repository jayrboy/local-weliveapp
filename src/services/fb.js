const graphUrl = 'https://graph.facebook.com/v20.0'

// ฟังก์ชัน เปิด Live Video บน User
export function openLiveVideo() {
  return fetch(`${graphUrl}/me/live_video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'LIVE_NOW',
      title: "Today's Live Video",
      description: 'This is the live video for today',
      access_token: import.meta.env.VITE_ACCESS_TOKEN,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err))
}

// https://developers.facebook.com/docs/live-video-api/interact-with-viewers/
// (1) Comments from Graph API
export async function getCommentsGraphAPI(liveVideoId, userAccessToken) {
  try {
    const response = await fetch(
      `${graphUrl}/${liveVideoId}/comments?access_token=${userAccessToken}`
    )

    if (!response.ok) {
      throw new Error('Error fetching comments from Graph API')
    }

    const data = await response.json()

    return data.data
  } catch (err) {
    throw new Error('Error fetching comments from Graph API')
  }
}

// https://developers.facebook.com/docs/messenger-platform/identity/id-matching
// ฟังก์ชันแปลง USER ID เป็น PSID
export const getPSID = async (userId, pageAccessToken) => {
  try {
    const response = await fetch(
      `${graphUrl}/${userId}?page=372569992597474&ids_for_pages&access_token=${pageAccessToken}&appsecret_proof={APP-SECRET}`
    ) // ใส่ ID ของเพจที่ต้องการแปลง

    if (!response.ok) {
      throw new Error('(#100) An owning business is required for this request')
    }

    const data = await response.json()
    const psid = data.data[0].id

    return psid
  } catch (err) {
    console.error('Error fetching PSID:', err)
    return null
  }
}

// ฟังก์ชันส่งข้อความกลับไปยัง PSID
export const sendMessageToPSID = async (psid, message, accessToken) => {
  const body = {
    recipient: { id: psid },
    message: { text: message },
  }

  try {
    const response = await fetch(
      `${graphUrl}/me/messages?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return await response.json()
  } catch (err) {
    console.error('Error sending message:', err)
  }
}
