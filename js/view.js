( w =>{
    var View_prototype = {
        render: e => {
            $('body').cls().add($$(e));
        },
        body: i => $$({
            header: {
                title: {h1_: _('Title')},
                domPrice,
                lang: [
                    $button('English').events({onclick: e=>{
                            history.pushState(null, null, '/en/'+window.location.hash);
                            TRANSLATE.setLang('en')
                        }}),
                    $button('Русский').events({onclick: e=>{
                            history.pushState(null, null, '/ru/'+window.location.hash);
                            TRANSLATE.setLang('ru')
                        }}),
                    $button('ROPSTEN').events({onclick: e=>{
                            ethApi.setProvider('ropstan')
                        }}),
                    $button('minenet').events({onclick: e=>{
                            ethApi.setProvider('main')

                        }}),

                ]
            },
            menu: [
                ['Home','#home'],
                ['Sign In','#sigin'],
                ['Edit','#edit'],
                ['About Us','#about-as'],
                ['FAQ','#faq'],
                ['Chack Without PK', '#cwpk']
            ].map(a=>$a(_(a[0]), {href: a[1]} ).events({onclick: e=>{
                    e.stopPropagation();
                    var el = e.target.parent.tagName === 'A'? e.target.parent: e.target;

                    for (var i = 0; i < el.parent.children.length; i++) {
                        el.parent.children[i].removeClass('active')
                    }
                    el.addClass('active')

                }})),
            body: [i],
            footer: [_('Footer')]
        }),
        elements: {
            ava: i => $$([
                $img({src: i}).addClass('avatar')
            ]),
            table_row: i => $$([
                i.title,
                View_prototype.elements.ava(i.ava)
            ])
        },
        templates: {

        },
        page: {
            Home: i => $$([
                i
            ])
        }
    };
    var instance = null;
    function View () {
        View_prototype.render(View_prototype.body());
    }

    View.instance = () => {
        if(!instance)
            instance = new View();
        return instance;
    };
    View.detectPage = () => {
        function updatePage() {
            //doc.set(page[window.location.hash.split('#')[1]] || page.home);
            TRANSLATE.setLang(window.location.pathname.replace(/\//g, ''))
            var el = $('a[href]')
            while (el = el.nextSibling) el.removeClass('active');

            el = $('a[href="' + window.location.hash + '"]');

            if (el) el.addClass('active')
            else $('a[href="#home"]').addClass('active');
        }
        window.onhashchange = updatePage;
        updatePage();
    };
    w.View = View;
})(window);