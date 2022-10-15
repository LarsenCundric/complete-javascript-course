document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

const btn = document.querySelector('button');
const textArea = document.querySelector('textarea');

const underscoreToCamelcase = (s) => {
  const icon = '✅';
  const lines = s.trim().split('\n');
  lines.forEach((line, i) => {
    const splitted = line.trim().split('_');
    let res = '';
    splitted.forEach((w, j) => {
      const lower = w.toLowerCase();
      const final = j > 0 ? lower.replace(lower[0], lower[0].toUpperCase()) : lower;
      res = res + final;
    });
    console.log(`${res.padEnd(30)}${icon.repeat(i + 1)}`)
  });
};

btn.addEventListener('click', function () {
  underscoreToCamelcase(textArea.value);
})