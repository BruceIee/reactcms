Reactlet Carousel
=================

Reactlet carousel component

![Treeview file system example](res/reactlet-carousel-demo.png)

```
<link rel="stylesheet" href="/component/common/common-style.css"/>
<link rel="stylesheet" href="/component/carousel/carousel.css"/>

<script src="/library/react/react.js"></script>
<script src="/library/react/JSXTransformer.js"></script>
<script type="text/jsx" src="/component/common/common-mixin.js"></script>
<script type="text/jsx" src="/component/carousel/carousel.js"></script>
<script type="text/jsx">
var app = app || {};
app.component1Data = {
    items: [
        { image:'/image/sample/desert.jpg', text:'slide 1' },
        { image:'/image/sample/lighthouse.jpg', text:'slide 2' },
        { image:'/image/sample/fallmum.jpg', text:'slide 3' },
        { image:'/image/sample/jellyfish.jpg', text:'slide 4' },
        { image:'/image/sample/koala.jpg', text:'slide 5' }
    ]
};
app.component1 = React.render(
    <Carousel data={ app.component1Data } />,
    document.getElementById('component1')
);
</script>
```
