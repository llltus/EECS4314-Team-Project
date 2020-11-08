
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.4' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Article.svelte generated by Svelte v3.29.4 */

    const { Object: Object_1 } = globals;
    const file = "src\\Article.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (77:4) {#each tones as tone}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*tone*/ ctx[3][0] + "";
    	let t0;
    	let t1;
    	let t2_value = /*tone*/ ctx[3][1].toFixed(2) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			attr_dev(div, "class", "tone_score svelte-18cezox");
    			add_location(div, file, 77, 6, 1850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tones*/ 2 && t0_value !== (t0_value = /*tone*/ ctx[3][0] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*tones*/ 2 && t2_value !== (t2_value = /*tone*/ ctx[3][1].toFixed(2) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(77:4) {#each tones as tone}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div5;
    	let div0;
    	let t0_value = /*article*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*article*/ ctx[0].published_date + "";
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = /*article*/ ctx[0].abstract + "";
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let t7_value = /*article*/ ctx[0].authors + "";
    	let t7;
    	let t8;
    	let div4;
    	let mounted;
    	let dispose;
    	let each_value = /*tones*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text("- ");
    			t7 = text(t7_value);
    			t8 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "title svelte-18cezox");
    			add_location(div0, file, 71, 2, 1595);
    			attr_dev(div1, "class", "date svelte-18cezox");
    			add_location(div1, file, 72, 2, 1639);
    			attr_dev(div2, "class", "abstract svelte-18cezox");
    			add_location(div2, file, 73, 2, 1691);
    			attr_dev(div3, "class", "author svelte-18cezox");
    			add_location(div3, file, 74, 2, 1741);
    			attr_dev(div4, "class", "tone_scores svelte-18cezox");
    			add_location(div4, file, 75, 2, 1790);
    			attr_dev(div5, "class", "card svelte-18cezox");
    			add_location(div5, file, 70, 0, 1546);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div1, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div2);
    			append_dev(div2, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, t6);
    			append_dev(div3, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div5, "click", /*openArticleLink*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*article*/ 1 && t0_value !== (t0_value = /*article*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*article*/ 1 && t2_value !== (t2_value = /*article*/ ctx[0].published_date + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*article*/ 1 && t4_value !== (t4_value = /*article*/ ctx[0].abstract + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*article*/ 1 && t7_value !== (t7_value = /*article*/ ctx[0].authors + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*tones*/ 2) {
    				each_value = /*tones*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Article", slots, []);
    	let { article } = $$props;
    	let tones;

    	const openArticleLink = () => {
    		window.open(article.url, "_self");
    	};

    	const writable_props = ["article"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("article" in $$props) $$invalidate(0, article = $$props.article);
    	};

    	$$self.$capture_state = () => ({ article, tones, openArticleLink });

    	$$self.$inject_state = $$props => {
    		if ("article" in $$props) $$invalidate(0, article = $$props.article);
    		if ("tones" in $$props) $$invalidate(1, tones = $$props.tones);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*article*/ 1) {
    			 $$invalidate(1, tones = Object.entries(article.tones));
    		}
    	};

    	return [article, tones, openArticleLink];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { article: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*article*/ ctx[0] === undefined && !("article" in props)) {
    			console.warn("<Article> was created without expected prop 'article'");
    		}
    	}

    	get article() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SearchBar.svelte generated by Svelte v3.29.4 */
    const file$1 = "src\\SearchBar.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let t1;
    	let label;
    	let input;
    	let t2;
    	let span0;
    	let t4;
    	let span1;
    	let i;
    	let t6;
    	let span2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Search";
    			t1 = space();
    			label = element("label");
    			input = element("input");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "   Search";
    			t4 = space();
    			span1 = element("span");
    			i = element("i");
    			i.textContent = "search";
    			t6 = space();
    			span2 = element("span");
    			attr_dev(button, "id", "searchButton");
    			set_style(button, "display", "none");
    			add_location(button, file$1, 107, 0, 2541);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "inp");
    			attr_dev(input, "placeholder", " ");
    			attr_dev(input, "class", "svelte-1bbvm1j");
    			add_location(input, file$1, 113, 2, 2677);
    			attr_dev(span0, "class", "label svelte-1bbvm1j");
    			add_location(span0, file$1, 119, 2, 2835);
    			attr_dev(i, "class", "material-icons");
    			add_location(i, file$1, 120, 21, 2909);
    			attr_dev(span1, "class", "icon svelte-1bbvm1j");
    			add_location(span1, file$1, 120, 2, 2890);
    			attr_dev(span2, "class", "focus-bg svelte-1bbvm1j");
    			add_location(span2, file$1, 121, 2, 2956);
    			attr_dev(label, "for", "inp");
    			attr_dev(label, "class", "inp svelte-1bbvm1j");
    			add_location(label, file$1, 112, 0, 2644);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			set_input_value(input, /*searchQuery*/ ctx[0]);
    			append_dev(label, t2);
    			append_dev(label, span0);
    			append_dev(label, t4);
    			append_dev(label, span1);
    			append_dev(span1, i);
    			append_dev(label, t6);
    			append_dev(label, span2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*emitSearchQuery*/ ctx[2], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchQuery*/ 1 && input.value !== /*searchQuery*/ ctx[0]) {
    				set_input_value(input, /*searchQuery*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SearchBar", slots, []);
    	const dispatch = createEventDispatcher();
    	let searchQuery = "";
    	const clickSearch = () => document.getElementById("searchButton").click();

    	function emitSearchQuery() {
    		document.activeElement.blur();
    		dispatch("testEmit", searchQuery);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SearchBar> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchQuery = this.value;
    		$$invalidate(0, searchQuery);
    	}

    	const keyup_handler = e => e.key === "Enter" && clickSearch();

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		searchQuery,
    		clickSearch,
    		emitSearchQuery
    	});

    	$$self.$inject_state = $$props => {
    		if ("searchQuery" in $$props) $$invalidate(0, searchQuery = $$props.searchQuery);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchQuery, clickSearch, emitSearchQuery, input_input_handler, keyup_handler];
    }

    class SearchBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchBar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\Chips.svelte generated by Svelte v3.29.4 */

    const file$2 = "src\\Chips.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (75:2) {#each tones as tone}
    function create_each_block$1(ctx) {
    	let div;
    	let input;
    	let input_name_value;
    	let input_value_value;
    	let input_id_value;
    	let t0;
    	let label;
    	let i;
    	let t1_value = /*tone*/ ctx[4].icon + "";
    	let t1;
    	let t2;
    	let t3_value = /*tone*/ ctx[4].name + "";
    	let t3;
    	let label_for_value;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			i = element("i");
    			t1 = text(t1_value);
    			t2 = text("  ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", input_name_value = /*tone*/ ctx[4].name.toLowerCase());
    			input.__value = input_value_value = /*tone*/ ctx[4].name.toLowerCase();
    			input.value = input.__value;
    			attr_dev(input, "id", input_id_value = /*tone*/ ctx[4].name.toLowerCase());
    			attr_dev(input, "class", "svelte-15y1add");
    			/*$$binding_groups*/ ctx[3][0].push(input);
    			add_location(input, file$2, 76, 6, 1662);
    			attr_dev(i, "class", "material-icons svelte-15y1add");
    			add_location(i, file$2, 84, 8, 1936);
    			attr_dev(label, "for", label_for_value = /*tone*/ ctx[4].name.toLowerCase());
    			attr_dev(label, "class", "svelte-15y1add");
    			add_location(label, file$2, 82, 6, 1843);
    			attr_dev(div, "class", "chip-item svelte-15y1add");
    			add_location(div, file$2, 75, 4, 1631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = ~/*group*/ ctx[0].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, i);
    			append_dev(i, t1);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			append_dev(div, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tones*/ 2 && input_name_value !== (input_name_value = /*tone*/ ctx[4].name.toLowerCase())) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*tones*/ 2 && input_value_value !== (input_value_value = /*tone*/ ctx[4].name.toLowerCase())) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*tones*/ 2 && input_id_value !== (input_id_value = /*tone*/ ctx[4].name.toLowerCase())) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*group*/ 1) {
    				input.checked = ~/*group*/ ctx[0].indexOf(input.__value);
    			}

    			if (dirty & /*tones*/ 2 && t1_value !== (t1_value = /*tone*/ ctx[4].icon + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*tones*/ 2 && t3_value !== (t3_value = /*tone*/ ctx[4].name + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*tones*/ 2 && label_for_value !== (label_for_value = /*tone*/ ctx[4].name.toLowerCase())) {
    				attr_dev(label, "for", label_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*$$binding_groups*/ ctx[3][0].splice(/*$$binding_groups*/ ctx[3][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(75:2) {#each tones as tone}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_value = /*tones*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "chip-container svelte-15y1add");
    			add_location(div, file$2, 73, 0, 1572);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tones, group*/ 3) {
    				each_value = /*tones*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chips", slots, []);
    	let { tones } = $$props;
    	let { group } = $$props;
    	const writable_props = ["tones", "group"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chips> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		group = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(0, group);
    	}

    	$$self.$$set = $$props => {
    		if ("tones" in $$props) $$invalidate(1, tones = $$props.tones);
    		if ("group" in $$props) $$invalidate(0, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({ tones, group });

    	$$self.$inject_state = $$props => {
    		if ("tones" in $$props) $$invalidate(1, tones = $$props.tones);
    		if ("group" in $$props) $$invalidate(0, group = $$props.group);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [group, tones, input_change_handler, $$binding_groups];
    }

    class Chips extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { tones: 1, group: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chips",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tones*/ ctx[1] === undefined && !("tones" in props)) {
    			console.warn("<Chips> was created without expected prop 'tones'");
    		}

    		if (/*group*/ ctx[0] === undefined && !("group" in props)) {
    			console.warn("<Chips> was created without expected prop 'group'");
    		}
    	}

    	get tones() {
    		throw new Error("<Chips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tones(value) {
    		throw new Error("<Chips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Chips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Chips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ThemeToggle.svelte generated by Svelte v3.29.4 */
    const file$3 = "src\\ThemeToggle.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let label;
    	let input;
    	let t0;
    	let div0;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			span = element("span");
    			span.textContent = "Enable dark mode ;)";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "checkbox");
    			attr_dev(input, "class", "svelte-nbglxu");
    			add_location(input, file$3, 96, 4, 1905);
    			attr_dev(div0, "class", "slider round svelte-nbglxu");
    			add_location(div0, file$3, 97, 4, 1975);
    			attr_dev(label, "class", "theme-switch svelte-nbglxu");
    			attr_dev(label, "for", "checkbox");
    			add_location(label, file$3, 95, 2, 1856);
    			attr_dev(span, "class", "svelte-nbglxu");
    			add_location(span, file$3, 99, 2, 2019);
    			attr_dev(div1, "class", "theme-switch-wrapper svelte-nbglxu");
    			add_location(div1, file$3, 94, 0, 1818);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(label, input);
    			/*input_binding*/ ctx[1](input);
    			append_dev(label, t0);
    			append_dev(label, div0);
    			append_dev(div1, t1);
    			append_dev(div1, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*input_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ThemeToggle", slots, []);
    	let toggleSwitch;

    	onMount(() => {
    		function switchTheme(e) {
    			if (e.target.checked) {
    				document.documentElement.setAttribute("data-theme", "dark");
    				localStorage.setItem("theme", "dark");
    			} else {
    				document.documentElement.setAttribute("data-theme", "light");
    				localStorage.setItem("theme", "light");
    			}
    		}

    		toggleSwitch.addEventListener("change", switchTheme, false);

    		const currentTheme = localStorage.getItem("theme")
    		? localStorage.getItem("theme")
    		: null;

    		if (currentTheme) {
    			document.documentElement.setAttribute("data-theme", currentTheme);

    			if (currentTheme === "dark") {
    				$$invalidate(0, toggleSwitch.checked = true, toggleSwitch);
    			}
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ThemeToggle> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			toggleSwitch = $$value;
    			$$invalidate(0, toggleSwitch);
    		});
    	}

    	$$self.$capture_state = () => ({ onMount, toggleSwitch });

    	$$self.$inject_state = $$props => {
    		if ("toggleSwitch" in $$props) $$invalidate(0, toggleSwitch = $$props.toggleSwitch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [toggleSwitch, input_binding];
    }

    class ThemeToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThemeToggle",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.29.4 */
    const file$4 = "src\\App.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (113:0) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*filteredArticles*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filteredArticles*/ 2) {
    				each_value = /*filteredArticles*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:0) {#if allArticles.length == 0}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "- No news articles found -";
    			attr_dev(div, "class", "empty-list-card svelte-noizik");
    			add_location(div, file$4, 111, 2, 3288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(111:0) {#if allArticles.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (114:2) {#each filteredArticles as article}
    function create_each_block$2(ctx) {
    	let article;
    	let current;

    	article = new Article({
    			props: { article: /*article*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(article.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(article, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const article_changes = {};
    			if (dirty & /*filteredArticles*/ 2) article_changes.article = /*article*/ ctx[8];
    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(article, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(114:2) {#each filteredArticles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let themetoggle;
    	let t0;
    	let searchbar;
    	let t1;
    	let chips;
    	let updating_group;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	themetoggle = new ThemeToggle({ $$inline: true });
    	searchbar = new SearchBar({ $$inline: true });
    	searchbar.$on("testEmit", /*queryArticles*/ ctx[4]);

    	function chips_group_binding(value) {
    		/*chips_group_binding*/ ctx[5].call(null, value);
    	}

    	let chips_props = { tones: /*tones*/ ctx[3] };

    	if (/*toneFilters*/ ctx[2] !== void 0) {
    		chips_props.group = /*toneFilters*/ ctx[2];
    	}

    	chips = new Chips({ props: chips_props, $$inline: true });
    	binding_callbacks.push(() => bind(chips, "group", chips_group_binding));
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*allArticles*/ ctx[0].length == 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(themetoggle.$$.fragment);
    			t0 = space();
    			create_component(searchbar.$$.fragment);
    			t1 = space();
    			create_component(chips.$$.fragment);
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(themetoggle, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(searchbar, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(chips, target, anchor);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const chips_changes = {};

    			if (!updating_group && dirty & /*toneFilters*/ 4) {
    				updating_group = true;
    				chips_changes.group = /*toneFilters*/ ctx[2];
    				add_flush_callback(() => updating_group = false);
    			}

    			chips.$set(chips_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(themetoggle.$$.fragment, local);
    			transition_in(searchbar.$$.fragment, local);
    			transition_in(chips.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(themetoggle.$$.fragment, local);
    			transition_out(searchbar.$$.fragment, local);
    			transition_out(chips.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(themetoggle, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(searchbar, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(chips, detaching);
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const fetchArticles = async () => {
    		const response = await fetch("http://3.85.125.119:5050/articles");

    		if (!response.ok) {
    			throw `Error occured: ${response.status}`;
    		}

    		const responseJson = await response.json();
    		return responseJson.articles;
    	};

    	let allArticles = [];
    	let queriedArticles = [];
    	let filteredArticles = [];
    	let toneFilters = [];

    	let tones = [
    		{
    			name: "Anger",
    			icon: "local_fire_department"
    		},
    		{ name: "Fear", icon: "pest_control" },
    		{ name: "Joy", icon: "emoji_nature" },
    		{
    			name: "Sadness",
    			icon: "sentiment_very_dissatisfied"
    		},
    		{ name: "Analytical", icon: "leaderboard" },
    		{ name: "Confident", icon: "emoji_objects" },
    		{ name: "Tentative", icon: "psychology" }
    	];

    	//fetch articles async
    	fetchArticles().then(articles => {
    		articles.forEach(article => $$invalidate(0, allArticles = [...allArticles, article]));
    		$$invalidate(6, queriedArticles = allArticles);
    	});

    	function queryArticles(event) {
    		$$invalidate(6, queriedArticles = []);

    		allArticles.forEach(a => {
    			for (var i = 0; i < a.keywords.length; i++) {
    				if (a.keywords[i].toLowerCase().includes(event.detail.toLowerCase())) {
    					$$invalidate(6, queriedArticles = [...queriedArticles, a]);
    					break;
    				}
    			}
    		});

    		$$invalidate(1, filteredArticles = []);
    		$$invalidate(1, filteredArticles = [...filteredArticles, queriedArticles]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function chips_group_binding(value) {
    		toneFilters = value;
    		$$invalidate(2, toneFilters);
    	}

    	$$self.$capture_state = () => ({
    		each,
    		is_empty,
    		Article,
    		SearchBar,
    		Chips,
    		ThemeToggle,
    		fetchArticles,
    		allArticles,
    		queriedArticles,
    		filteredArticles,
    		toneFilters,
    		tones,
    		queryArticles
    	});

    	$$self.$inject_state = $$props => {
    		if ("allArticles" in $$props) $$invalidate(0, allArticles = $$props.allArticles);
    		if ("queriedArticles" in $$props) $$invalidate(6, queriedArticles = $$props.queriedArticles);
    		if ("filteredArticles" in $$props) $$invalidate(1, filteredArticles = $$props.filteredArticles);
    		if ("toneFilters" in $$props) $$invalidate(2, toneFilters = $$props.toneFilters);
    		if ("tones" in $$props) $$invalidate(3, tones = $$props.tones);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*queriedArticles, toneFilters*/ 68) {
    			//reactive tone filtering
    			 $$invalidate(1, filteredArticles = queriedArticles.filter(article => {
    				let matches = false;

    				if (toneFilters.length == 0) {
    					return true;
    				} else {
    					toneFilters.forEach(toneFilter => {
    						if (article.tones.hasOwnProperty(toneFilter)) {
    							matches = true;
    						}
    					});

    					return matches;
    				}
    			}).//reactive tone sorting (total score method)
    			sort((a1, a2) => {
    				let a1Score = 0;
    				let a2Score = 0;

    				toneFilters.forEach(tone => {
    					if (a1.tones.hasOwnProperty(tone.toLowerCase())) {
    						a1Score += a1.tones[tone.toLowerCase()];
    					}

    					if (a2.tones.hasOwnProperty(tone.toLowerCase())) {
    						a2Score += a2.tones[tone.toLowerCase()];
    					}
    				});

    				return parseFloat(a2Score) - parseFloat(a1Score);
    			}));
    		}
    	};

    	return [
    		allArticles,
    		filteredArticles,
    		toneFilters,
    		tones,
    		queryArticles,
    		chips_group_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
