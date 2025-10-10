const AsciiHeader = () => {
    const art = `
   d8888b.  .d8b.  d8888b. db   db
   88  '8D d8' '8b 88  '8D 88   88
   88oobY' 88ooo88 88   88 88ooo88
   88'8b   88~~~88 88   88 88~~~88
   88 '88. 88   88 88  .8D 88   88
   88   YD YP   YP Y8888D' YP   YP

        .g8"""bgd          db      d88888b
      .d8'     '8b        ;8     8P'    'Y
      d8'       '8b      ,8'     8b
      88         88     ,8P      88
      '8b       d8'    ,8P       '8b    .8
       'Y8,""8bdP'    ,8P'         'Y8888P'
    `;

    return (
        <pre className="text-accent opacity-70 animate-fade-in text-xs md:text-sm">
            {art}
        </pre>
    );
};

export default AsciiHeader;
