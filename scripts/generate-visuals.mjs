import { writeFileSync } from 'node:fs';
const directory = new URL('../src/assets/visuals/', import.meta.url);
const colors = { ink: '#080b12', panel: '#111722', line: '#354254', text: '#edf1f7', muted: '#a6b2c5', violet: '#a997ff', blue: '#78b8ff', orange: '#ffb27f' };
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, value, size = 18, fill = colors.text, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(value)}</text>`;
const rect = (x,y,w,h,fill=colors.panel,stroke=colors.line) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" stroke="${stroke}"/>`;
const line = (d, color=colors.line) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2"/>`;
const save = (name,w,h,body) => writeFileSync(new URL(name+'.svg',directory),`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none"><g font-family="ui-monospace, SFMono-Regular, Consolas, monospace">${body}</g></svg>\n`);
save('pipeline',640,630,
rect(94,20,452,160)+text(116,47,'postsRepository.cra',13,colors.muted)+line('M94 62H546')+text(116,88,'@AsyncAfter',15,colors.violet)+text(116,111,'fun getPosts(): List<Post> {',15)+text(132,134,'re fetchPosts()',15)+text(116,157,'}',15)+
line('M320 180V225',colors.violet)+rect(136,225,368,66)+text(162,253,'CROSSA COMPILER',17,colors.violet)+text(162,278,'Parse → Validate → Typed IR',15,colors.muted)+line('M320 291V327',colors.blue)+
rect(104,327,432,103,'#111e30',colors.blue)+text(128,361,'Native C++ runtime',23,colors.blue)+text(128,389,'Schedule · HTTP · Decode',16)+text(128,412,'Models · Errors · Lifecycle',16,colors.muted)+line('M320 430V464H154V501M320 464H486V501',colors.blue)+
rect(22,501,280,104)+rect(338,501,280,104)+text(42,533,'Android .aar',20,colors.orange)+text(42,562,'Kotlin API → JNI → .so',15,colors.muted)+text(358,533,'iOS .xcframework',20,colors.blue)+text(358,562,'Swift API → C ABI',15,colors.muted)+text(42,590,'Your Android UI',15)+text(358,590,'Your iOS UI',15));
save('duplication',800,360,
text(28,35,'Separate implementations',21,colors.muted)+text(480,35,'One shared definition',21,colors.violet)+
[28,228].map((x,i)=>text(x,80,i?'iOS':'Android',19)+['Transport','Serialization','Models','Error mapping'].map((v,j)=>rect(x,102+j*48,174,38)+text(x+12,127+j*48,v,16,colors.muted)).join('')).join('')+
line('M438 60V330')+rect(544,68,174,48)+text(600,99,'.cra',20,colors.violet)+line('M630 116V158',colors.violet)+rect(492,158,276,66,'#111e30',colors.blue)+text(517,198,'Crossa native runtime',19,colors.blue)+line('M630 224V259H531V292M630 259H727V292',colors.blue)+text(489,320,'Android',18)+text(706,320,'iOS',18));
save('runtime',800,450,
rect(16,40,768,374,'#0d1420',colors.blue)+text(43,82,'CROSSA NATIVE RUNTIME',22,colors.blue)+text(43,112,'One coordinated execution and ownership boundary',16,colors.muted)+
line('M44 137H756')+text(48,173,'Scheduler',19,colors.violet)+line('M170 167H745',colors.violet)+
['Request encoding','Networking','Response buffer','Typed decode'].map((v,i)=>text(48+(i%2)*375,227+Math.floor(i/2)*67,v,21)).join('')+
line('M247 220H395M580 235V264H247',colors.blue)+line('M43 326H755')+text(48,363,'Native models',19,colors.blue)+text(320,363,'Errors',19)+text(500,363,'Lifecycle',19)+text(48,392,'Bounded storage',15,colors.muted)+text(320,392,'Typed states',15,colors.muted)+text(500,392,'Cancellation / shutdown',15,colors.muted));
for(const platform of ['android','ios']) {
 const android=platform==='android',accent=android?colors.orange:colors.blue;
 save(platform+'-artifact',540,380,
 line('M90 45L440 45L490 95V325H90Z',accent)+rect(60,75,380,260,'#111722',accent)+text(86,111,android?'ANDROID RELEASE':'IOS RELEASE',17,accent)+line('M60 134H440',accent)+text(86,183,android?'.aar':'.xcframework',34,accent)+text(86,219,android?'Generated Kotlin API':'Generated Swift API',19)+text(86,252,android?'JNI · libcrossa_runtime.so':'Stable C ABI · C++ runtime',17,colors.muted)+text(86,292,android?'arm64-v8a':'arm64 device + simulator',16,colors.muted)+text(88,363,android?'crossa-generated-release.aar':'Crossa.xcframework',17));
}
save('ecosystem',800,370,
rect(215,25,370,95,'#111e30',colors.violet)+text(246,64,'Crossa Core',25,colors.violet)+text(246,95,'Compiler · Runtime · CLI',18,colors.muted)+line('M400 120V168H170V221M400 168H630V221',colors.blue)+
rect(30,221,300,108)+rect(470,221,300,108)+text(55,262,'Android Example',22,colors.orange)+text(55,295,'AAR integration + evidence',16,colors.muted)+text(495,262,'iOS Example',22,colors.blue)+text(495,295,'XCFramework + evidence',16,colors.muted));
save('broken-pipeline',600,180,rect(20,40,175,90)+text(65,96,'.cra',28,colors.violet)+line('M195 85H268M335 85H405')+line('M282 66L318 104M318 66L282 104',colors.orange)+rect(405,40,175,90)+text(427,94,'artifact?',21,colors.muted));
save('android-example',430,932,
`<rect width="430" height="932" fill="#f8f5fc"/>`+
text(24,36,'Android example',14,'#605b68')+rect(16,70,398,255,'#f0eaf5','#f0eaf5')+
text(30,106,'Crossa Network',22,'#211b2b')+text(30,133,'Benchmark',22,'#211b2b')+
`<rect x="320" y="91" width="76" height="44" rx="22" fill="#675094"/>`+text(340,119,'Run',16,'#ffffff')+
text(30,163,'GET jsonplaceholder.typicode.com/posts',12,'#605b68')+
['Mode Warm','Warmups 2','Measured 8','Artifact release','Build release'].map((label,index)=>{const x=30+(index%3)*122,y=188+Math.floor(index/3)*42;return rect(x,y,115,33,'#e6dff0','#e6dff0')+text(x+9,y+22,label,11,'#352d40');}).join('')+
text(30,296,'Observations only. Remote latency is not SDK overhead.',10,'#605b68')+
text(30,370,'Run the benchmark to inspect',17,'#605b68')+text(30,398,'Crossa, Retrofit and Ktor.',17,'#605b68')+
line('M160 904H270','#605b68'));
save('duplication-mobile',360,490,
text(16,30,'Without Crossa',19,colors.muted)+text(24,68,'Android',17)+text(205,68,'iOS',17)+
['Transport','Serialization','Models','Errors'].map((value,index)=>[16,190].map(x=>rect(x,86+index*38,154,31)+text(x+10,107+index*38,value,14,colors.muted)).join('')).join('')+
line('M90 238V263H180M267 238V263H180V298',colors.violet)+text(16,290,'With Crossa',16,colors.violet)+
rect(64,311,232,68,'#111e30',colors.blue)+text(152,336,'.cra',16,colors.violet)+text(85,363,'Crossa native runtime',16,colors.blue)+line('M180 379V407H80V436M180 407H280V436',colors.blue)+text(41,460,'Android',18)+text(265,460,'iOS',18));
save('pipeline-mobile',360,575,
rect(18,10,324,138)+text(36,34,'postsRepository.cra',12,colors.muted)+line('M18 47H342')+text(36,69,'@AsyncAfter',13,colors.violet)+text(36,89,'fun getPosts(): List<Post> {',12)+text(50,109,'re fetchPosts()',12)+text(36,129,'}',12)+line('M180 148V181',colors.violet)+
rect(38,181,284,65)+text(55,207,'Crossa compiler',19,colors.violet)+text(55,231,'Parse → Validate → Typed IR',14,colors.muted)+line('M180 246V279',colors.blue)+
rect(20,279,320,97,'#111e30',colors.blue)+text(40,311,'Native C++ runtime',21,colors.blue)+text(40,337,'Schedule · HTTP · Decode',15)+text(40,360,'Models · Errors · Lifecycle',15,colors.muted)+line('M180 376V412H92V443M180 412H270V443',colors.blue)+
rect(10,443,164,113)+rect(186,443,164,113)+text(23,472,'Android',19,colors.orange)+text(23,497,'.aar',18,colors.orange)+text(23,522,'Kotlin → JNI',14)+text(23,545,'Native .so',14,colors.muted)+text(199,472,'iOS',19,colors.blue)+text(199,497,'.xcframework',15,colors.blue)+text(199,522,'Swift → C ABI',14)+text(199,545,'Native slices',14,colors.muted));
save('runtime-mobile',360,550,
rect(10,10,340,529,'#0d1420',colors.blue)+text(28,46,'Native C++ runtime',23,colors.blue)+text(28,76,'One execution boundary',16,colors.muted)+line('M28 97H332')+
['Scheduler','Request encoding','Networking','Response buffer','Typed decode','Native models','Errors','Lifecycle + cancellation'].map((label,index)=>text(29,133+index*49,label,18,index===0?colors.violet:colors.text)+(index<7?line(`M38 ${142+index*49}V${158+index*49}`,colors.blue):'')).join(''));
save('ecosystem-mobile',360,420,
rect(10,10,340,87,'#111e30',colors.violet)+text(30,43,'Crossa Core',23,colors.violet)+text(30,76,'Compiler · Runtime · CLI',16,colors.muted)+line('M180 97V131H40V344',colors.blue)+
line('M40 189H70M40 344H70',colors.blue)+rect(70,142,280,95)+text(88,178,'Android Example',21,colors.orange)+text(88,210,'AAR + integration evidence',14,colors.muted)+rect(70,297,280,95)+text(88,333,'iOS Example',21,colors.blue)+text(88,365,'XCFramework + evidence',14,colors.muted));
