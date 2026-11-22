// What people say. Everyone can be spoken to; nobody has to be.
// Lines are picked by role, then by what the player has done so far. Nothing here is required for the story.
export const ROLE_NAME = { student: 'a student', staff: 'a member of staff', visitor: 'a visitor', elder: 'a retired reader', child: 'a child', runner: 'a runner', parent: 'a parent', cyclist: 'a cyclist', dogwalker: 'a dog walker', reader: 'a reader', cart: 'the book cart keeper', vendor: 'the drinks seller', busker: 'a busker', painter: 'a painter', chess: 'a chess player', gardener: 'the gardener', birder: 'a birdwatcher', taichi: 'someone practising tai chi', guide: 'a tour guide', tourist: 'a visitor on the tour', kitekid: 'a child with a kite', ballkid: 'a child with a ball', snowkid: 'a child building a snowman', schoolkid: 'a pupil on a school trip', storykid: 'a child at story hour', storyteller: 'the story hour reader', robot: 'a delivery robot' };
export const LINES = {
  student: ['I have a problem set due and I am out here counting pigeons. It is called sampling. That is my story.', 'Everyone in my seminar read the same five books this term. Nobody planned it.', 'My lab partner says plot it first. She is always right, which is annoying.', 'I walk a different way to class each week. You notice more.', 'I tried the library screen for a book on tide tables. It offered me a thriller.', 'The trick with a long reading list is to read the odd one first.', 'I learned today that the median does not care how rich the richest person is.', 'There is a rumour the head librarian is looking for someone good with tables.'],
  staff: ['We moved a lot of books off-site last year. Nobody was borrowing them. I do wonder which came first.', 'The annual report has one chart. It goes up. Everyone claps.', 'I miss the card catalogue. You found things next to the thing you wanted.', 'A model is a tidy way of being wrong. The useful ones are wrong in ways you know about.', 'Lunch is the only meeting where people say what they think.', 'If you want to know what a building is for, watch where people actually walk.'],
  visitor: ['We came for the day. The children wanted to see the robot.', 'Is it always this quiet? I could get used to it.', 'I took the wrong turning and found the nicest bench.', 'Somebody told me there is something odd hidden here. I have not found it.', 'I like a place where people read outdoors.'],
  elder: ['I have had a library card for sixty years. The screens are new. The books are getting fewer, I think.', 'When I was young we chose a book by its spine and its smell.', 'I asked the screen for local history. It gave me what it gave my neighbour.', 'Sit down a minute. The light is good at this hour.', 'I count the ducks every morning. Thirty-one years of records in a shoebox.', 'People say the machine knows what I like. It knows what I borrowed. That is not the same.'],
  child: ['I can count to a hundred in threes. Almost.', 'Do robots get tired?', 'My brother says the screen at the library is magic. I think it is just lazy.', 'I found a snail. It is the slowest one. I measured.', 'Why is the first book on the screen always the same one?', 'I am not lost. I am exploring.'],
  runner: ['Same loop every day. I keep the times in a notebook. The trend is not what I hoped.', 'Can’t stop. Well. One minute. Then my average is ruined.', 'I ran a new route today and found a whole street I had never seen.'],
  parent: ['She picks the first book on the screen every single time. I have started covering it with my hand.', 'We are trying to read one odd book a week. It is harder to find them than you would think.', 'The baby sleeps as long as the pram is moving. That is a causal claim and I stand by it.', 'Story hour is the best part of our week.'],
  cyclist: ['Tailwind out, headwind home. My average speed says nothing happened.', 'I count the red lights. Eleven today. A record.', 'The short way and the quick way are different ways.'],
  dogwalker: ['She has met every dog in this park. I keep a list. It is a small social network.', 'He always goes to the same tree. I do not know what he sees in it.', 'You learn a place by walking it at the same hour every day.'],
  reader: ['Shh. Good part.', 'I found this on the returns trolley. Nobody had taken it out in nine years. It is wonderful.', 'I read the last page first. It is a kind of holdout test.', 'The screen never offers me poetry any more. I used to borrow a lot of it. Then a bit less. Then it stopped asking.', 'Take a margin note. I collect them.'],
  cart: ['This is the Common Shelf cart. Take one, leave one. I choose what goes on it by hand.', 'I put the forgotten ones on the top row. Top row goes first. Always has.', 'People take what is at eye level. I could run this whole cart by moving three books.', 'You are the one working with Ines? Tell her the cart never narrowed.'],
  vendor: ['Hot today, so everyone wants cold. I do not need a model for that.', 'The regulars order the same thing. If I put a new thing on the board, half of them try it.', 'I sell more when the queue is short and the queue is short when I sell less. Work that out.'],
  busker: ['I play what people stop for. Then I only know songs people stop for.', 'Requests cost double if I have played it already today.', 'This tune is in a scale with five notes. You cannot play a wrong one.'],
  painter: ['I paint the same view each season. It is never the same view.', 'You have to decide what to leave out. That is most of it.', 'From far away it is a tree. Up close it is eleven strokes.'],
  chess: ['I look three moves ahead. He looks four. That is the whole difference.', 'Every move is a guess about what matters.', 'We have played four hundred games. He is ahead by two.'],
  gardener: ['I prune in winter. Cut too much and you lose next year’s fruit.', 'The rare ones need a corner of their own or the common ones crowd them out.', 'Leaves fall where the wind decides. I rake where the path is.'],
  birder: ['Forty species here this year. Most days you see the same six.', 'If you only count at the feeder you will think every bird likes seeds.', 'There. No. Gone. That one does not make the list unless I am sure.'],
  taichi: ['Slowly. The point is to notice.', 'Same movements every morning. Small corrections.'],
  guide: ['On your left, a building. On your right, another. The interesting thing is usually behind you.', 'We lose one person per tour. On average.', 'Ask me anything. I may make it up, but I will tell you when I do.'],
  tourist: ['I have taken ninety photographs and looked at nothing.', 'Our guide says there is a hidden thing here somewhere.', 'Which way is the library?'],
  kitekid: ['It goes up when I run. It goes up more when it is windy. I am doing an experiment.', 'Hold this. No, do not let go!'],
  ballkid: ['We do not keep score. Well. I do.', 'Three more goals and then we swap sides.'],
  snowkid: ['He needs a nose. Have you got a carrot?', 'We measured him. He is taller than my brother.'],
  schoolkid: ['We have to count things for a worksheet. I am counting worksheets.', 'Our teacher says a robot lives in the library.'],
  storykid: ['Shhh! It is the good bit.', 'Pip says there is a book about a snail and a lighthouse but nobody can find it.'],
  storyteller: ['Story hour is at four. I choose the book myself. The screen keeps suggesting the same one.', 'The children’s room used to have a shelf of odd ones. They went off-site two winters ago.'],
  robot: ['[It chirps, shows a small parcel icon, and waits politely for you to move.]', '[A panel on its lid reads: “Delivering. Please do not ride.”]'],
};
// What people say about the screen, by how far the story has gone (Part I to IV).
export const RUMOUR = [
  ['The screen at the library? It is handy. Five books, and one of them is usually right.', 'I never look past the first two it shows. Who has the time?', 'Marginalia knew I wanted that novel before I did. Or it showed it to me until I did. Hard to say.'],
  ['My whole department borrowed the same textbook the year we had reading lists. That was us, not the machine.', 'They changed the system a few years back. For a month the numbers at our branch looked odd.', 'When Marginalia went down at Weir Street we all just wandered the shelves. I came home with a book on moss.'],
  ['My daughter taps the first book on the screen. Every time. It could be a phone directory.', 'I used to find strange things by accident. Not for a while.', 'I heard they tested it on pretend readers who could only choose from the screen. Well, then.'],
  ['They say there is a column missing from the records. What the screen showed. Nobody kept it.', 'If they start showing a few books at random, I hope I get the odd ones.', 'It is a library. They would never keep a list of what each of us looked at. Quite right too.'],
];
export const ANIMALS = {
  'mallard drake': 'A mallard drake. Green head, grey body. Easy to count, so everyone counts them, so every pond seems to be mostly mallards.', 'mallard hen': 'A mallard hen. Speckled brown, and easy to miss beside the drake.', duckling: 'A duckling. It follows the first large moving thing it sees.', swan: 'A mute swan. One swan changes the average weight of the pond’s birds a great deal, and the median not at all.', heron: 'A grey heron. It stands still for a very long time. A sampling strategy.', goose: 'A goose. It has opinions about your being here.',
  sparrow: 'A house sparrow. Common, so nobody writes it down. Then one decade it is gone and nobody has the numbers.', robin: 'A robin. It sings at dusk and dawn, when the counters have gone home.', tit: 'A blue tit. It learns from watching other tits.', pigeon: 'A pigeon. Trained pigeons have been taught to sort pictures by category.', blackbird: 'A blackbird, turning leaves over.', gull: 'A gull, far from any sea.',
  squirrel: 'A grey squirrel. It buries far more nuts than it will ever find again.', 'black squirrel': 'A black squirrel: the same species as the grey, in a rarer colour.', rabbit: 'A rabbit. Where there is one, the sample is not finished.', cat: 'A cat. It is watching the birds and pretending not to.', dog: 'A dog. It knows this walk better than its owner does.', deer: 'A deer at the edge of the trees. Count them at dusk and you get a different number.', stag: 'A stag. One per herd, which makes for a small sample.', sheep: 'A sheep. Counting them is said to help with sleep. The evidence is thin.', butterfly: 'A butterfly. Transect walks, the same path every week, are how they are counted.', fish: 'A fish breaks the surface and is gone.',
};
export const FOLIO_LATE = ['Folio stops at a shelf mark on the wall: “Rare books, row R”. Its tray tilts, as if it were about to fetch something. Then it rolls on.', 'Folio’s log shows its last rare-book fetch: four years ago.', 'Folio has drawn a small map on your tablet. Every route on it leads to the same hundred shelves. One corner is blank.'];
// The people of Deckle. Lines are grouped by how far the year has gone: Part I, II, III, IV, and after the board meeting.
export const HOME = {
  odile: { name: 'Odile Larch', role: 'bookbinder, and your landlady', lines: [
    ['A book is sewn before it is glued. People forget the sewing because they cannot see it.', 'Your rent includes tea. It does not include Pip’s questions. Those are extra.'],
    ['Fewer odd books come in for rebinding these days. The same hundred come back worn to pieces.', 'Cold enough for you? The glue takes twice as long to set.'],
    ['I rebound a botany book this week. The slip in the back says it has not been out since Tomas was at school.', 'Wren wants to know whether a machine can be wrong on purpose. I told her to ask you.'],
    ['Ines says you have found a name for the empty column. Good. A thing without a name gets lost.', 'Pip has been asking about that snail book again.'],
    ['I hear the board voted. A library that offers you something you did not ask for. That is how it used to be.'] ] },
  tomas: { name: 'Tomas Larch', role: 'signalman at Deckle junction', lines: [
    ['The board shows departures. I set the signals. If the two ever disagree, believe the signals.', 'A signal only tells a driver what I show it. Worth remembering, in your line of work.'],
    ['The night flight leaves from the far platform. Dress warm.', 'Trains are a graph. Stations are the dots, track is the lines. I read that in one of Wren’s library books.'],
    ['If every train took the busiest line, the branch lines would rust. So we run trains on them even when they are quiet.', 'Wren can come with you at weekends and in the holidays. She will ask why. A lot.'],
    ['Pip taps the first book on the children’s screen like it is a doorbell.', 'I heard you want to run some trains at random. So to speak.'],
    ['They kept the branch lines open. So to speak.'] ] },
  pip: { name: 'Pip Larch', role: 'aged seven', lines: [
    ['I want the snail book. The one with the lighthouse. The screen never has it.', 'I drew you a picture. It is under your door. It is a snail.'],
    ['Wren says the screen only knows five books. That is not very many. I know nine.', 'Is it winter because the trees ran out of leaves?'],
    ['I asked the robot for the snail book. It went to the corner where the old shelves are and came back with nothing.', 'If I tap the last one on the screen and not the first one, what happens?'],
    ['Wren says you are going to make the screen show surprise books. Can one of them be about a snail?'],
    ['[Pip is sitting on the floor of the children’s room with a picture book. On the cover, a snail is carrying a lantern up a spiral stair. Pip does not look up.]'] ] },
  wren: { name: 'Wren Larch', role: 'aged eleven', lines: [
    ['Why does the library need a machine to tell people what to read? Did people forget how?', 'Can I come? I will be quiet. Mostly.'],
    ['If the machine is right more often, why is Ines worried?', 'I counted. The same five books were on every screen in the reading room.'],
    ['Does the machine know it is making everyone the same? Can a machine know things?', 'I think Folio is sad. Can a robot be sad?'],
    ['So the column was just what the screen showed? And nobody wrote it down? That is the whole mystery?', 'If you flip a coin to choose the books, is that still clever?'],
    ['I am going to count how many different books my class borrows this year. I have a notebook.'] ] },
  librarian: { name: 'Ines Varga', role: 'head librarian of the Common Shelf', lines: [
    ['Accuracy up. Breadth down. The board reads the first number and goes home.', 'Start with the table. The session room is through the blue door.', 'I do not think anyone did anything wrong. That is what worries me.'],
    ['Dov built Marginalia. He optimised what the board asked for, and he did it well.', 'Your cards are on the case board. Some of them point the same way. Do not decide yet.'],
    ['The children’s room troubles me most. Seven-year-olds do not scroll.', 'I would like to audit it properly. When you are ready, the challenge is on your tablet.'],
    ['If we cannot know what the screens showed in the past, can we find out from now on? Without keeping a file on every reader?', 'When your core sessions are done, come and see me. The board meets at the end of summer.'],
    ['The column has a header now. Thank you. Go and see the children’s room.'] ] },
  engineer: { name: 'Dov Achterberg', role: 'the engineer who built Marginalia', lines: [
    ['It predicts the next loan. That was the brief. It is very good at the brief.'], ['Version two put readers in clusters. Tidy. Fast.'], ['I tested each version before it shipped. On simulated readers, admittedly.'], ['A few random slots would cost us accuracy. On paper.'], ['I have changed the dashboard. Hit rate is now the fourth number on it.'] ] },
  cameo: { name: 'A man with a laptop', role: 'waiting for a train', lines: [
    ['[He is plotting something on a laptop balanced on his knees. He looks up, says hello, and asks whether you plotted your data before you summarised it. Then he goes back to his chart.]'],
    ['[He is marking a stack of papers. He asks which you would rather have: a model that predicts, or one that explains. He does not wait for the answer. He seems to think it depends.]'],
    ['[He is reading something about horses and arithmetic and laughing quietly. He says the platform is a good place to think because the trains decide when you stop.]'],
    ['[He is typing. Without looking up he says that the most interesting column in any table is the one that is not there. His train is called. He does not get on it.]'],
    ['[He closes the laptop, nods at you, and says well done. On the lid is a sticker: a small table with one blank header. Someone has written a word in it by hand.]'] ] },
};
