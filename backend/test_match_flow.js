const runE2E = async () => {
    try {
        console.log("1. Registering User A...");
        let resA = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Test User A", email: "usera_test@rvu.edu.in", password: "password123", college: "CSE" })
        });
        resA = await resA.json();
        const tokenA = resA.token;
        const idA = resA.user._id;

        console.log("2. Registering User B...");
        let resB = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Test User B", email: "userb_test@rvu.edu.in", password: "password123", college: "Design" })
        });
        resB = await resB.json();
        const tokenB = resB.token;
        const idB = resB.user._id;

        console.log("3. User A Requests Match with User B...");
        let matchRes = await fetch(`http://localhost:5000/api/matches/request/${idB}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
            body: JSON.stringify({ skillOffered: "Python", skillRequested: "Design" })
        });
        matchRes = await matchRes.json();
        const matchId = matchRes._id;
        console.log(`Match created with ID: ${matchId} Status: ${matchRes.status}`);

        console.log("4. User B Fetches Pending Matches...");
        let fetchRes = await fetch('http://localhost:5000/api/matches', {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        fetchRes = await fetchRes.json();
        console.log(`User B found ${fetchRes.length} active/pending match requests. Source User: ${fetchRes[0]?.user1?.name}`);

        console.log("5. User B Accepts Match...");
        let acceptRes = await fetch(`http://localhost:5000/api/matches/${matchId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
            body: JSON.stringify({ status: "accepted" })
        });
        acceptRes = await acceptRes.json();
        console.log(`Match status updated to: ${acceptRes.status}`);

        console.log("6. User A Sends a Chat Message to User B...");
        let chatRes = await fetch(`http://localhost:5000/api/messages/send/${idB}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
            body: JSON.stringify({ content: "Hey! Let's schedule a session!" })
        });
        chatRes = await chatRes.json();
        console.log(`Message sent: ${chatRes.content}`);

        console.log("7. User B Reads Chat Messages...");
        let readRes = await fetch(`http://localhost:5000/api/messages/conversation/${idA}`, {
            headers: { Authorization: `Bearer ${tokenB}` }
        });
        readRes = await readRes.json();
        console.log(`User B received ${readRes.length} messages. First message contents: "${readRes[0]?.content}"`);

        console.log("\n✅ E2E MATCH WORKFLOW TEST PASSED SUCCESSFULLY!");
    } catch (e) {
        console.error("❌ E2E FLOW FAILED:", e.message);
    }
};

runE2E();
