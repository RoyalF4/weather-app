function getTemp(data, unit) {
  let low;
  let high;
  if (unit === 'fahrenheit') {
    low = data.day.mintemp_f;
    high = data.day.maxtemp_f;
  } else {
    low = data.day.mintemp_c;
    high = data.day.maxtemp_c;
  }
  const div = document.createElement('div');
  div.classList.add('temperature');
  div.innerHTML = `${high}&deg; / ${low}&deg;`;
  return div;
}
export default getTemp;
