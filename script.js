// FIFO
function pageFaultsFIFO(pages, n, capacity) {
  console.log('We are in FIFO');
  let frames = new Array(capacity).fill(-1); 
  let queue = []; 
  let r = capacity + 3, c = pages.length + 2, val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame ' + (i - 1);
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;

  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;

    if (!frames.includes(pages[i])) {
      if (queue.length >= capacity) {
        let pageToReplace = queue.shift(); 
        let indexToReplace = frames.indexOf(pageToReplace); 
        frames[indexToReplace] = pages[i]; 
      } else {
        frames[queue.length] = pages[i]; 
      }
      queue.push(pages[i]); 
      page_faults++;
    }

    arr[r - 1][i + 2] = prev_page_faults === page_faults ? '✓' : '✗';

    
    for (let j = 0; j < capacity; j++) {
      arr[2 + j][2 + i] = frames[j] !== -1 ? frames[j] : ' ';
    }
  }

  buildTable(arr); 
  return page_faults; 
}

//LFU
function pageFaultsLFU(pages, n, capacity) {
  console.log('We are in LFU');
  let frames = new Array(capacity).fill(-1); 
  let frequency = new Map(); 
  let pageTime = new Map(); 
  let r = capacity + 3, c = pages.length + 2, val = ' ';
  let arr = new Array(r);

  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }

  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame ' + (i - 1);
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;

  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;

    if (!frames.includes(pages[i])) {
      if (frequency.size >= capacity) {
        let lfuPage = null;
        let minFreq = Infinity;

        for (let [page, freq] of frequency.entries()) {
          if (freq < minFreq || (freq === minFreq && pageTime.get(page) < pageTime.get(lfuPage))) {
            minFreq = freq;
            lfuPage = page;
          }
        }

        let lfuIndex = frames.indexOf(lfuPage);
        frames[lfuIndex] = pages[i];
        frequency.delete(lfuPage);
        pageTime.delete(lfuPage);
      } else {
        let emptyIndex = frames.indexOf(-1);
        frames[emptyIndex] = pages[i];
      }
      
      page_faults++;
    }

    frequency.set(pages[i], (frequency.get(pages[i]) || 0) + 1);
    pageTime.set(pages[i], i);

    arr[r - 1][i + 2] = prev_page_faults === page_faults ? '✓' : '✗';

    for (let j = 0; j < capacity; j++) {
      arr[2 + j][2 + i] = frames[j] !== -1 ? frames[j] : ' ';
    }
  }

  buildTable(arr);
  return page_faults;
}

// LRU
function pageFaultsLRU(pages, n, capacity) {
  console.log('We are in LRU');
  let frames = new Array(capacity).fill(-1); 
  let recent = new Map(); 
  let r = capacity + 3, c = pages.length + 2, val = ' ';
  let arr = new Array(r);

  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }

  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame ' + (i - 1);
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;

  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;

    if (!frames.includes(pages[i])) {
      if (recent.size >= capacity) {
        let lruPage = null;
        let lruIndex = null;
        let oldestTime = Infinity;

        for (let [page, time] of recent.entries()) {
          if (time < oldestTime) {
            oldestTime = time;
            lruPage = page;
          }
        }

        lruIndex = frames.indexOf(lruPage);
        frames[lruIndex] = pages[i];
        recent.delete(lruPage);
      } else {
        let emptyIndex = frames.indexOf(-1);
        frames[emptyIndex] = pages[i];
      }
      
      page_faults++;
    }

    recent.set(pages[i], i);

    arr[r - 1][i + 2] = prev_page_faults === page_faults ? '✓' : '✗';

    for (let j = 0; j < capacity; j++) {
      arr[2 + j][2 + i] = frames[j] !== -1 ? frames[j] : ' ';
    }
  }

  buildTable(arr);
  return page_faults;
}

// NRU 
function pageFaultsNRU(pages, n, capacity) {
  console.log('We are in NRU');
  let frames = new Array(capacity).fill(-1); // Mảng khung trang để theo dõi các trang hiện tại trong bộ nhớ.
  let referenceBit = new Array(capacity).fill(0); // Mảng để theo dõi bit tham chiếu của các trang.
  let modifiedBit = new Array(capacity).fill(0); // Mảng để theo dõi bit sửa đổi của các trang.
  let r = capacity + 3, c = pages.length + 2, val = ' ';
  let arr = new Array(r);

  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }

  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame ' + (i - 1);
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;

  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    let pageIndex = frames.indexOf(pages[i]);

    // Reset reference bits periodically (for simulation purposes, reset every 5 references)
    if (i % 5 === 0) {
      referenceBit.fill(0);
    }

    if (pageIndex !== -1) {
      // If page is already in a frame, mark it as referenced
      referenceBit[pageIndex] = 1;
    } else {
      // Page fault
      page_faults++;
      let replacementIndex = -1;

      // Find a page to replace based on NRU categories
      for (let category = 0; category < 4; category++) {
        for (let j = 0; j < capacity; j++) {
          let ref = referenceBit[j];
          let mod = modifiedBit[j];
          if (
            (category === 0 && ref === 0 && mod === 0) ||
            (category === 1 && ref === 0 && mod === 1) ||
            (category === 2 && ref === 1 && mod === 0) ||
            (category === 3 && ref === 1 && mod === 1)
          ) {
            replacementIndex = j;
            break;
          }
        }
        if (replacementIndex !== -1) break;
      }

      if (replacementIndex === -1) {
        // If no suitable page is found (should not happen), replace the first page
        replacementIndex = 0;
      }

      // Replace the selected page
      frames[replacementIndex] = pages[i];
      referenceBit[replacementIndex] = 1;
      modifiedBit[replacementIndex] = 0; // Assuming the new page is not modified
    }

    arr[r - 1][i + 2] = prev_page_faults === page_faults ? '✓' : '✗';

    for (let j = 0; j < capacity; j++) {
      arr[2 + j][2 + i] = frames[j] !== -1 ? frames[j] : ' ';
    }
  }

  buildTable(arr);
  return page_faults;
}

// OPT
function pageFaultsOPT(pages, n, capacity) {
  console.log('We are in OPT');
  let frames = new Array(capacity).fill(-1); 
  let r = capacity + 3, c = pages.length + 2, val = ' ';
  let arr = new Array(r);

  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }

  arr[0][0] = 'Page';
  arr[1][0] = 'Reference String';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'Frame ' + (i - 1);
  arr[r - 1][0] = 'Hit/Miss';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;

  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;

    if (!frames.includes(pages[i])) {
      if (frames.includes(-1)) {
        let emptyIndex = frames.indexOf(-1);
        frames[emptyIndex] = pages[i];
      } else {
        let future = new Array(capacity).fill(Infinity);

        for (let j = 0; j < capacity; j++) {
          for (let k = i + 1; k < n; k++) {
            if (frames[j] === pages[k]) {
              future[j] = k;
              break;
            }
          }
        }

        let optIndex = future.indexOf(Math.max(...future));
        frames[optIndex] = pages[i];
      }
      page_faults++;
    }

    arr[r - 1][i + 2] = prev_page_faults === page_faults ? '✓' : '✗';

    for (let j = 0; j < capacity; j++) {
      arr[2 + j][2 + i] = frames[j] !== -1 ? frames[j] : ' ';
    }
  }

  buildTable(arr);
  return page_faults;
}

function pushData() {
  let summaryCheck = document.querySelector('#Summary').checked;
  if (!summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
  }
  let pra = document.querySelector('#pra').value;
  pra = pra.toString();

  pages = [];
  let inputText = document.getElementById('references').value;
  let frames = Number(document.querySelector('.noofframes').value);
  inputText = inputText.split(' ');
  for (let i = 0; i < inputText.length; i++) {
    inputText[i] = Number(inputText[i]);
    pages.push(Number(inputText[i]));
  }

  let faults = 0;
  if (pra === 'LRU') {
    faults = pageFaultsLRU(pages, pages.length, frames);
  } else if (pra === 'FIFO') {
    faults = pageFaultsFIFO(pages, pages.length, frames);
  } else if (pra === 'LFU') {
    faults = pageFaultsLFU(pages, pages.length, frames);
  } else if (pra === 'NRU') {
    faults = pageFaultsNRU(pages, pages.length, frames);
  } else if (pra === 'OPT') {
    faults = pageFaultsOPT(pages, pages.length, frames);
  } 
  else {
    const part2 = document.querySelector('.part2');
    document.querySelector('.part1').innerHTML = '';
    document.querySelector('.part3').innerHTML = '';
    part2.innerHTML = '';
    part2.innerHTML = `<h1 class='opt'><b>Feature Not Available Yet</b></h1>`;
    return;
  }

  buildSchedule(frames, pra, pages, faults, summaryCheck);
}

function buildSchedule(frames, str, pages, faults, summaryCheck) {
  if (summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
    const head = document.createElement('div');
    head.id = 'head';
    head.innerHTML = `<h2>Summary - ${str} Algorithm</h2>`;
    part1.appendChild(head);
    const base = document.createElement('div');
    base.id = 'base';
    base.innerHTML = `
    <ul>
        <li>Total frames: ${frames}</li>
        <li>Algorithm: ${str}</li>
        <li>Reference string length: ${pages.length} references</li>
        <li>String: ${pages}</li>
      </ul>`;
    part1.appendChild(base);
  }
  const count = {};
  pages.forEach((element) => {
    count[element] = (count[element] || 0) + 1;
  });
  const distinctPages = Object.keys(count).length;
  const part3 = document.querySelector('.part3');
  part3.innerHTML = '';
  const calcs = document.createElement('div');
  calcs.innerHTML = `<ul><li>Total references: ${pages.length}</li>
        <li>Total distinct references: ${distinctPages}</li>
        <li>Hits: ${pages.length - faults}</li>
        <li>Faults: ${faults}</li>
        <li><b>Hit rate:</b> ${pages.length - faults}/${pages.length} = <b>${(
    (1 - faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li>
        <li><b>Fault rate:</b> ${faults}/${pages.length} = <b>${(
    (faults / pages.length) *
    100
  ).toFixed(2)}</b>%</li></ul>`;
  part3.appendChild(calcs);
}

function buildTable(arr) {
  const part2 = document.querySelector('.part2');
  part2.innerHTML = '';
  var mytable = '<table>';
  let i = 0,
    j = 0;
  for (var CELL of arr) {
    mytable += `<tr class="r${i}">`;
    for (var CELLi of CELL) {
      if (CELLi === '✗' || CELLi == '✓') {
        mytable += `<td class="c${j} ${CELLi}">` + CELLi + '</td>';
      } else {
        mytable += `<td class="c${j} ">` + CELLi + '</td>';
      }
      j++;
    }
    j = 0;
    mytable += '</tr>';
    i++;
  }
  mytable += '</table>';
  part2.innerHTML = mytable;
}
