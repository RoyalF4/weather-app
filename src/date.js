import { format } from 'date-fns';

function getDate(date) {
  const div = document.createElement('div');
  div.classList.add('date');
  div.textContent = format(new Date(date), 'E i');
  return div;
}

export default getDate;
