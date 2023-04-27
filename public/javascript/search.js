const searchInput = document.querySelector('#search-input');
const debounce = (func, delay) => {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
searchInput.addEventListener('input', debounce((e) => {
  const search = e.target.value;
  if (search) {
    window.location.href = `?search=${search}`;
  } else {
    window.location.search = '';
  }
}, 800));