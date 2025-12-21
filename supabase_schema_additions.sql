
-- 1. Create Table for Game Content
create table if not exists game_content (
  id uuid default uuid_generate_v4() primary key,
  type text check (type in ('joke', 'charade', 'dare', 'story', 'future')),
  content jsonb not null, -- Stores the actual data: { "setup": "...", "punchline": "..." }
  is_used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table game_content enable row level security;

-- 3. Create Policies
create policy "Anyone can read unused content"
  on game_content for select
  using ( true );

create policy "Authenticated users can update usage"
  on game_content for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can insert new content"
  on game_content for insert
  with check ( auth.role() = 'authenticated' );

-- 4. Seed Data (100 Items)
INSERT INTO game_content (type, content) VALUES
-- JOKES (25)
('joke', '{"setup": "Why don''t scientists trust atoms?", "punchline": "Because they make up everything!"}'),
('joke', '{"setup": "What do you call a fake noodle?", "punchline": "An Impasta!"}'),
('joke', '{"setup": "Why did the scarecrow win an award?", "punchline": "He was outstanding in his field!"}'),
('joke', '{"setup": "What do you call a bear with no teeth?", "punchline": "A gummy bear!"}'),
('joke', '{"setup": "Why did the bicycle fall over?", "punchline": "Because it was two-tired!"}'),
('joke', '{"setup": "What do you call a magic dog?", "punchline": "A Labracadabrador!"}'),
('joke', '{"setup": "Why don''t eggs tell jokes?", "punchline": "They''d crack each other up!"}'),
('joke', '{"setup": "What do you call a sleeping dinosaur?", "punchline": "A dino-snore!"}'),
('joke', '{"setup": "Why couldn''t the pony sing a lullaby?", "punchline": "He was a little horse!"}'),
('joke', '{"setup": "What divides by zero and conquers worlds?", "punchline": "Nothing!"}'),
('joke', '{"setup": "How does the ocean say hi?", "punchline": "It waves!"}'),
('joke', '{"setup": "What do you call a factory that makes okay products?", "punchline": "A satisfactory!"}'),
('joke', '{"setup": "Why did the math book look sad?", "punchline": "Because it had too many problems."}'),
('joke', '{"setup": "What has ears but cannot hear?", "punchline": "A cornfield."}'),
('joke', '{"setup": "Why did the cookie go to the hospital?", "punchline": "Because he felt crummy."}'),
('joke', '{"setup": "What do you call a pile of cats?", "punchline": "A meowtain."}'),
('joke', '{"setup": "Why are skeletons so calm?", "punchline": "Because nothing gets under their skin."}'),
('joke', '{"setup": "What kind of shorts do clouds wear?", "punchline": "Thunderwear."}'),
('joke', '{"setup": "What do you call a fish wearing a bowtie?", "punchline": "Sofishticated."}'),
('joke', '{"setup": "Why did the golfer bring two pairs of pants?", "punchline": "In case he got a hole in one."}'),
('joke', '{"setup": "What do you call a snowman with a six-pack?", "punchline": "An abdominal snowman."}'),
('joke', '{"setup": "Why do bees have sticky hair?", "punchline": "Because they use honeycombs."}'),
('joke', '{"setup": "What do you call a belt made of watches?", "punchline": "A waist of time."}'),
('joke', '{"setup": "Why did the tomato turn red?", "punchline": "Because it saw the salad dressing."}'),
('joke', '{"setup": "What instrument does a skeleton play?", "punchline": "The trom-bone."}'),

-- CHARADES (25)
('charade', '{"movie": "The Lion King", "emoji": "🦁 👑 🌅"}'),
('charade', '{"movie": "Frozen", "emoji": "❄️ 👸 ☃️"}'),
('charade', '{"movie": "Finding Nemo", "emoji": "🔍 🐠 🌊"}'),
('charade', '{"movie": "Toy Story", "emoji": "🤠 🚀 🧸"}'),
('charade', '{"movie": "Harry Potter", "emoji": "⚡ 👓 🧙"}'),
('charade', '{"movie": "Spider-Man", "emoji": "🕷️ 🕸️ 🦸"}'),
('charade', '{"movie": "Up", "emoji": "🎈 🏠 👴"}'),
('charade', '{"movie": "Cars", "emoji": "🚗 ⚡ 🏁"}'),
('charade', '{"movie": "Kung Fu Panda", "emoji": "🐼 🥋 🍜"}'),
('charade', '{"movie": "Moana", "emoji": "🌊 🛶 🐔"}'),
('charade', '{"movie": "Shrek", "emoji": "👹 🏰  donkey"}'),
('charade', '{"movie": "Star Wars", "emoji": "⚔️ 🌌 👽"}'),
('charade', '{"movie": "Jurassic Park", "emoji": "🦖 🦕 🌴"}'),
('charade', '{"movie": "Aladdin", "emoji": "🧞 🕌 🐒"}'),
('charade', '{"movie": "Beauty and the Beast", "emoji": "🌹 👹 📚"}'),
('charade', '{"movie": "Coco", "emoji": "🎸 💀 🕯️"}'),
('charade', '{"movie": "Inside Out", "emoji": "😊 😢 😡"}'),
('charade', '{"movie": "Zootopia", "emoji": "🐰 🦊 🚓"}'),
('charade', '{"movie": "The Little Mermaid", "emoji": "🧜‍♀️ 🦀 🌊"}'),
('charade', '{"movie": "Ratatouille", "emoji": "🐀 👨‍🍳 🍲"}'),
('charade', '{"movie": "Minions", "emoji": "🍌 👓 💛"}'),
('charade', '{"movie": "Monsters Inc", "emoji": "👁️ 🚪 👹"}'),
('charade', '{"movie": "Incredibles", "emoji": "🦸‍♂️ 🦸‍♀️ 👶"}'),
('charade', '{"movie": "Wall-E", "emoji": "🤖 🌱 🚀"}'),
('charade', '{"movie": "Encanto", "emoji": "🕯️ 🏠 🦋"}'),

-- DARES (25)
('dare', '{"role": "Any", "text": "Do your best chicken dance for 30 seconds."}'),
('dare', '{"role": "Any", "text": "Speak in a robot voice until your next turn."}'),
('dare', '{"role": "Dad", "text": "Let the kids style your hair correctly."}'),
('dare', '{"role": "Son", "text": "Give Dad a compliment about his cooking."}'),
('dare', '{"role": "Any", "text": "Try to lick your elbow (impossible!)."}'),
('dare', '{"role": "Any", "text": "Walk backwards everywhere for the next 5 minutes."}'),
('dare', '{"role": "Dad", "text": "Show us your best disco dance move."}'),
('dare', '{"role": "Any", "text": "Hold a plank for 20 seconds."}'),
('dare', '{"role": "Son", "text": "Pretend you are the Dad and give everyone orders."}'),
('dare', '{"role": "Any", "text": "Make a funny face and hold it for 10 seconds."}'),
('dare', '{"role": "Any", "text": "Do 10 jumping jacks while singing silly sounds."}'),
('dare', '{"role": "Dad", "text": "Tell a story using only animal noises."}'),
('dare', '{"role": "Any", "text": "Balance a spoon on your nose for 10 seconds."}'),
('dare', '{"role": "Son", "text": "Draw a mustache on your face with a washable marker."}'),
('dare', '{"role": "Any", "text": "Try to juggle 3 items (use soft items!)."}'),
('dare', '{"role": "Dad", "text": "Let the kids choose your profile picture for a day."}'),
('dare', '{"role": "Any", "text": "Speak only in whispers for the next round."}'),
('dare', '{"role": "Any", "text": "Pretend to be a T-Rex trying to make a bed."}'),
('dare', '{"role": "Son", "text": "Clean up one thing in the room right now."}'),
('dare', '{"role": "Any", "text": "Do your best evil laugh."}'),
('dare', '{"role": "Dad", "text": "Recite a nursery rhyme like a Shakespeare actor."}'),
('dare', '{"role": "Any", "text": "Don''t blink for 30 seconds (staring contest!)."}'),
('dare', '{"role": "Any", "text": "Pretend to be a waiter and take everyone''s order."}'),
('dare', '{"role": "Son", "text": "Give a 1-minute speech about why broccoli is great."}'),
('dare', '{"role": "Any", "text": "Walk like a crab across the room."}'),

-- FUTURE PREDICTIONS (Simulated AI) (25)
('future', '{"prediction": "In 20 years, you will be the first person to open a restaurant on Mars. It serves only space-pizza."}'),
('future', '{"prediction": "You will invent a pair of glasses that lets you see fart clouds. You become a billionaire."}'),
('future', '{"prediction": "You will become a professional napper. You win Gold at the Olympics for sleeping."}'),
('future', '{"prediction": "You will accidentally become the King of a small island inhabited only by squirrels."}'),
('future', '{"prediction": "You will invent a machine that translates dog barks into English. Your own dog just complains about the food."}'),
('future', '{"prediction": "You will be a famous rockstar, but your instrument is the electric triangle."}'),
('future', '{"prediction": "You will discover a new color. It’s called ''Super-Pink'' and it glows in the dark."}'),
('future', '{"prediction": "You will be the first astronaut to forget their keys inside the rocketship."}'),
('future', '{"prediction": "You will start a fashion trend wearing socks on your ears. It goes global."}'),
('future', '{"prediction": "You will invent teleportation, but it only works for sandwiches."}'),
('future', '{"prediction": "You will be elected President of the Galaxy. Your first law: Free Ice Cream Fridays."}'),
('future', '{"prediction": "You will write a bestselling book titled ''How to Annoy Your Parents via Interpretive Dance''."}'),
('future', '{"prediction": "You will own a zoo where all the animals are robots."}'),
('future', '{"prediction": "You will become a master chef who only cooks giant foods."}'),
('future', '{"prediction": "You will discover that you are actually 5% alien."}'),
('future', '{"prediction": "You will build a robot butler that does your homework, but it gets everything wrong."}'),
('future', '{"prediction": "You will be a superhero named ''The Procrastinator''. You''ll save the world... tomorrow."}'),
('future', '{"prediction": "You will invent a gum that never loses its flavor."}'),
('future', '{"prediction": "You will be a famous detective who solves mysteries using only bubblegum wrappers."}'),
('future', '{"prediction": "You will live in a house made entirely of Lego bricks."}'),
('future', '{"prediction": "You will win the lottery, but you have to spend it all on rubber ducks."}'),
('future', '{"prediction": "You will be the first person to high-five a whale."}'),
('future', '{"prediction": "You will invent a phone that charges by yelling at it."}'),
('future', '{"prediction": "You will be the world champion of hide-and-seek. No one has found you since 2045."}'),
('future', '{"prediction": "You will accidentally invent a time machine while trying to fix the toaster."}');
