const config = require('./secret.config.json');
const taTapIn_url = config.ta_tapin_url;
const stats_url = config.stats_url;

export async function taTapIn(name) {
  try {
    await fetch(taTapIn_url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: name})
    });
  } catch(error) {
    console.log(error);
  }

}

export async function postStats(students, avgTime) {
  try {
    await fetch(stats_url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({students: students, avgTime: avgTime})
    });
  } catch (error) {
    console.log(error);
  }
}
