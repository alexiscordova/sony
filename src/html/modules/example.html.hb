---
name: 'example module'
meta_data: {a:'foo', b:'bar'}
---
<div>
			<h1>{{document.name}}: {{mode}}</h1>
			<ul>
				<li>{{content.a}} {{document.meta_data.a}}</li>
				<li>{{content.b}} {{document.meta_data.b}}</li>
			</ul>
		</div>