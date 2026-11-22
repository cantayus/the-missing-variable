// Carriage problems: one short puzzle for the journey. Nothing rides on them, and you can look out of the window instead.
import { el, clear } from '../core/util.js';
import { S, save } from '../core/save.js';
import { sheet } from '../ui/pages.js';
import { sfx } from '../audio/sound.js';

export const PROBLEMS = [
  { id: 'benford', title: 'First digits', ask: 'The guard has a ledger of the populations of four hundred towns. Roughly how many of the figures begin with a 1?',
    options: ['About one in nine', 'About three in ten', 'About half'], right: 1,
    why: 'About 30%. Figures that spread over several sizes, such as populations, river lengths and prices, start with a 1 far more often than with a 9. This is Benford’s law. Accountants use it to spot invented numbers, because people who make figures up tend to spread the first digits evenly.' },
  { id: 'birthday', title: 'Shared birthdays', ask: 'How many passengers does the carriage need before it is more likely than not that two of them share a birthday?',
    options: ['23', '92', '183'], right: 0,
    why: '23. With 23 people there are 253 different pairs, and each pair is a chance of a match. The chance of at least one shared birthday is just over a half, 50.7%, if you ignore leap years and assume birthdays are spread evenly.' },
  { id: 'doors', title: 'Three doors', ask: 'A prize is behind one of three doors. You pick one. The host, who knows where the prize is, opens another door to show it is empty, and offers you the last one. Should you swap?',
    options: ['Swap: it wins two times in three', 'It makes no difference', 'Stay: your first guess was as good as any'], right: 0,
    why: 'Swap. Your first pick is right one time in three. The other two times the prize is behind one of the remaining doors, and the host has just shown you which of them it is not. The catch is in the rules: the host knows, and always opens an empty door.' },
  { id: 'tanks', title: 'How many wagons?', ask: 'Goods wagons on this line are numbered 1, 2, 3 and so on. You have seen five of them go by. The highest number was 60. What is a fair estimate of how many wagons there are?',
    options: ['60', '71', '120'], right: 1,
    why: 'About 71. Take the highest number seen, add the average gap you would expect between sightings, and take one off: 60 + 60 ÷ 5 − 1. In the Second World War, Allied statisticians estimated German tank production this way from serial numbers on captured tanks, and came closer than the intelligence reports did.' },
  { id: 'bombers', title: 'Where to put the armour', ask: 'Bombers come back from raids with holes in the wings and tail, and very few in the engines. You can add armour to one place. Where?',
    options: ['The wings and tail, where the holes are', 'The engines, where the holes are not', 'Evenly all over'], right: 1,
    why: 'The engines. You are only looking at the planes that came home. Holes in the wings did not stop them. The planes hit in the engines are the ones you never saw. The statistician Abraham Wald made this argument during the Second World War, and it is the usual example of survivorship bias.' },
  { id: 'hiring', title: 'The hiring line', ask: 'Twenty people will apply for a job, one after another. You must say yes or no to each on the spot and cannot call anyone back. What gives the best chance of ending up with the very best?',
    options: ['Take the first good one', 'Let the first seven go, then take the next who beats them all', 'Wait for the last three'], right: 1,
    why: 'Let about 37% go by to learn what good looks like, then take the first person who beats everyone so far. This finds the very best about 37% of the time, which is the best any rule can do. The number is 1 divided by e.' },
  { id: 'hospitals', title: 'Two hospitals', ask: 'A large hospital has about 45 births a day and a small one about 15. Over a year, which records more days on which over 60% of the babies were boys?',
    options: ['The large one', 'The small one', 'About the same'], right: 1,
    why: 'The small one. A small sample swings further from one half than a large one does, so lopsided days are commoner there. Daniel Kahneman and Amos Tversky put this question to people in the 1970s, and most answered “about the same”.' },
  { id: 'disease', title: 'A positive test', ask: 'One person in a thousand has a certain illness. A test catches 99 of every 100 people who have it, and wrongly flags 5 of every 100 who do not. Your test is positive. How likely is it that you have the illness?',
    options: ['About 95 in 100', 'About 50 in 100', 'About 2 in 100'], right: 2,
    why: 'About 2 in 100. Test 100,000 people: 100 have the illness and 99 of them test positive. Of the 99,900 who do not, about 4,995 also test positive. So only 99 of roughly 5,094 positives are real. When an illness is rare, most alarms are false ones.' },
  { id: 'pairs', title: 'Twenty measurements', ask: 'You measure twenty unrelated things about each town: rainfall, shoe sizes, the number of bakeries. You test every pair for a link, calling it real if chance alone would give it one time in twenty. How many “real” links should you expect?',
    options: ['None', 'One', 'Nine or ten'], right: 2,
    why: 'Nine or ten. Twenty things make 190 pairs, and one in twenty of 190 is 9.5. Test enough pairs and some will pass by luck alone. This is why a surprising link from a large trawl needs checking on fresh data.' },
  { id: 'dimensions', title: 'The skin of the box', ask: 'A box has ten measurements instead of three. Points are scattered evenly inside it. What share of them lie in the outer skin, within a twentieth of the way in from some face?',
    options: ['About 10%', 'About 30%', 'About 65%'], right: 2,
    why: 'About 65%. To miss the skin a point must be in the middle nine tenths along every one of the ten measurements, and 0.9 multiplied by itself ten times is 0.35. With many measurements almost everything is near an edge and far from everything else, which makes “nearest neighbour” a weak idea.' },
  { id: 'envelopes', title: 'Two envelopes', ask: 'One envelope holds twice as much as the other. You open yours and find ten coins. The other holds five or twenty, which averages twelve and a half. Does that mean you should always swap?',
    options: ['Yes, swapping gains on average', 'No, swapping gains nothing', 'Only if you see an odd number'], right: 1,
    why: 'No. If the argument were sound it would tell you to swap whichever envelope you held, and then to swap back. Its mistake is treating “five” and “twenty” as equally likely whatever you find. How likely each is depends on how the envelopes were filled, which you were not told.' },
  { id: 'bridges', title: 'Seven bridges', ask: 'A river town has two islands and seven bridges. Three bridges meet at each bank and at one island, and five at the other. Can you take a walk that crosses every bridge exactly once?',
    options: ['Yes, starting from the island with five bridges', 'Yes, from either bank', 'No, it cannot be done'], right: 2,
    why: 'No. Each time you pass through a place you use one bridge in and one out, so every place except the start and finish needs an even number of bridges. Here all four have an odd number. Leonhard Euler proved this about the bridges of Königsberg in 1736, and the study of networks starts with that proof.' },
  { id: 'librarian', title: 'The travelling librarian', ask: 'The book van sets out from one branch, must call at the other nine, and come back. How many different round trips are there to choose from?',
    options: ['100', '3,628', '181,440'], right: 2,
    why: '181,440. There are nine choices for the first call, eight for the next, and so on. Halve the total, because a route and its reverse are the same trip. Add a few more branches and no computer can check them all, which is why delivery routes are found by clever shortcuts and not by trying everything.' },
  { id: 'waiting', title: 'Waiting for the tram', ask: 'Trams come every ten minutes on average, but not evenly: sometimes two together, sometimes a long gap. You turn up at a random moment. How long do you wait, on average?',
    options: ['Less than five minutes', 'Exactly five minutes', 'More than five minutes'], right: 2,
    why: 'More than five. You are more likely to arrive during a long gap than a short one, because long gaps take up more of the day. The same thing makes most people’s classes feel bigger than the average class: more pupils sit in the big ones.' },
  { id: 'streaks', title: 'A hundred coin tosses', ask: 'Toss a fair coin a hundred times. How likely is a run of six or more heads in a row, or six or more tails?',
    options: ['About 1 in 20', 'About 1 in 3', 'About 4 in 5'], right: 2,
    why: 'About 4 in 5. Long runs are normal in random sequences. People asked to write down a “random” list of heads and tails avoid them, which is one way a teacher can tell an invented list from a tossed one.' },
  { id: 'friends', title: 'Your friends’ friends', ask: 'Ask everyone in town how many friends they have. Then ask how many friends their friends have. Which average is larger?',
    options: ['Their own count', 'Their friends’ count', 'They are the same'], right: 1,
    why: 'Their friends’. Someone with forty friends appears on forty people’s lists, and someone with two appears on two. So popular people are counted many times over when you average over friends. The sociologist Scott Feld described this in 1991.' },
  { id: 'average', title: 'The richest table', ask: 'Nine people in the dining car earn about the same. A tenth sits down who earns a hundred times as much. Which figure for “what people in this car earn” hardly changes?',
    options: ['The average', 'The middle value', 'Both jump'], right: 1,
    why: 'The middle value, or median. The average is pulled up more than tenfold by one person. The median is still one of the nine. When a few values are far larger than the rest, as with incomes, house prices and loan counts, the median says more about the typical case.' },
];

export function carriageProblem(then, id) {
  const done = S().carriage || (S().carriage = {}), left = PROBLEMS.filter((q) => !done[q.id]);
  const q = PROBLEMS.find((x) => x.id === id) || (left.length ? left : PROBLEMS)[Math.floor(Math.random() * (left.length || PROBLEMS.length))];
  let gone = false; const go = (close) => { if (gone) return; gone = true; close(); then(); };
  sheet('In the carriage: ' + q.title.toLowerCase(), (p, close) => {
    const body = el('div'); p.append(body);
    const render = (pick) => {
      clear(body); body.append(el('p', { style: { fontSize: '1.08em' } }, q.ask));
      body.append(el('div.seg.tall', q.options.map((o, i) => el('button' + (pick === i ? '.on' : ''), { disabled: pick != null, onclick: () => { done[q.id] = i === q.right ? 'right' : 'seen'; save(); sfx(i === q.right ? 'met' : 'tap'); render(i); } }, o))));
      if (pick != null) body.append(el('p.verdict' + (pick === q.right ? '.good' : ''), [el('b', pick === q.right ? 'Right. ' : 'Not this time. '), q.why]));
      body.append(el('div.row', [el('button.btn' + (pick != null ? '.go' : '.quiet'), { onclick: () => go(close) }, pick != null ? 'The train pulls in' : 'Look out of the window instead')]));
    };
    render(null);
  }, { cls: 'challenge', onClose: () => { if (!gone) { gone = true; then(); } } });
}
