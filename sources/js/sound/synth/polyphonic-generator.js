import VCO from 'sound/synth/vco';
import VCA from 'sound/synth/vca';
import EnveloppeGenerator from 'sound/synth/enveloppe-generator';
import EventEmitter from 'events';
import times from 'lodash.times';

function create_polyphonic_generator(state) {

	const vcos = times(state.num_voices, () => VCO(state.audio_context));
	const vcas = times(state.num_voices, () => VCA(state.audio_context));
	const enveloppes = times(state.num_voices, () => EnveloppeGenerator());
	const channel_merger = state.audio_context.createChannelMerger();
	const polyphony_manager = create_polyphony_manager(state.num_voices);

	return {
		connect({input}) {
			times(state.num_voices, i => {
				vcos[i].connect(vcas[i]);
				vcas[i].connect({input: channel_merger});
				enveloppes[i].connect({param:vcas[i].gain});
			});
			channel_merger.connect(input);
		},
		voiceOn(freq, time) {
			const voice = polyphony_manager.assign(freq);
			console.log(vcos);
			vcos[voice].gateOn(freq, time);
			enveloppes[voice].gateOn(time);
		},
		voiceOff(freq, time){
			const voice = polyphony_manager.unassign(freq);
			if(voice >= 0){
				enveloppes[voice].gateOff(time);
			}
		},
		get type(){
			return {
				set value(value){
					vcos.forEach(vco => vco.type = value);
				}
			};
		},
		get gain(){
			return {
				set value(value){
					vcas.forEach(vca => vca.value = value);
				}
			};
		},
		get release(){
			return {
				set value(value){
					enveloppes.forEach(enveloppe => enveloppe.release = value);
				}
			}
		},
		set form(type) {
			vcos.forEach(vco => vco.form = type);
		},
		set attack(value){
			enveloppes.forEach(enveloppe => enveloppe.attack = value);
		},
		set decay(value){
			enveloppes.forEach(enveloppe => enveloppe.decay = value);
		},
		set sustain(value){
			enveloppes.forEach(enveloppe => enveloppe.sustain = value);
		},
		// set gain(value){
		// 	vcas.forEach(vca => vca.value = value);
		// },
		set release(value){
			enveloppes.forEach(enveloppe => enveloppe.release = value);
		}
	};
}

function create_polyphony_manager(num_voices){
	const freqs = new Array(num_voices);
	let index = 0;
	return {
		assign(freq) {
			index = ++index % freqs.length;
			freqs[index] = freq;
			return index;
		},
		unassign(freq) {
			return freqs.indexOf(freq);
		}
	}
}

export default(audio_context, {num_voices})=> {
	const state = {
		audio_context: audio_context,
		emitter: new EventEmitter(),
		num_voices: num_voices
	};
	return Object.assign(state.emitter, create_polyphonic_generator(state));
}
