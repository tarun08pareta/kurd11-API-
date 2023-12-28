const axios = require('axios');

exports.upcomingMatches = async () => {
    
    const options = {
        method: 'GET',
        url: 'https://fantasy-cricket.p.rapidapi.com/getcricketupcomingmatches',
        headers: {
            'X-RapidAPI-Key': 'b17cd5dcedmshcd19178ae814ce8p114ea9jsn89dab763b4fa',
            'X-RapidAPI-Host': 'fantasy-cricket.p.rapidapi.com'
        }
    };
    
    try {
        async function fetchData() {
            const response = await axios.request(options);
            console.log(response.data);
        }
        fetchData();
    } catch (error) {
        console.error(error);
    }
}