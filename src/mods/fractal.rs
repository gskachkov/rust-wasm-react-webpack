use num_complex::Complex;
use std::collections::HashMap;

use image;

static mut SHARED_VECS: Option<HashMap<u32, Vec<u8>>> = None;

#[no_mangle]
pub fn fractal_init() {
    unsafe { SHARED_VECS = Some(HashMap::new()) }
}

#[no_mangle]
pub fn fractal_vec_len(payload: *const u8) -> u32 {
    unsafe {
        SHARED_VECS
            .as_ref()
            .unwrap()
            .get(&(payload as u32))
            .unwrap()
            .len() as u32
    }
}

pub fn vec2js<V: Into<Vec<u8>>>(v: V) -> *const u8 {
    let v = v.into();
    let payload = v.as_ptr();
    unsafe {
        SHARED_VECS.as_mut().unwrap().insert(payload as u32, v);
    }
    payload
}

#[no_mangle]
pub extern "C" fn fractal_free_vec(payload: *const u8) {
    unsafe {
        SHARED_VECS.as_mut().unwrap().remove(&(payload as u32));
    }
}

fn hue_to_rgb(i: f32) -> f32 {
    let mut h = i as f32;
    if h > 1.0 {
        h = h - 1.0;
    }
    let ret = match h {
        h if h < 0.16 => 6.0 * h,
        h if h < 0.5 => 1.0,
        h if h < 0.67 => (0.67 - h) * 6.0,
        _ => 1.0
    };
    ret * 255.0
}

fn fractal(imgx: i32, imgy: i32, cparam: i32) -> image::ImageBuffer<image::Rgba<u8>, Vec<u8>> {
    let zoom = 4.0;
    let offsetx = 0.0;
    let offsety = 0.0;
    let c_param = Complex::new(cparam as f32 * 0.02, cparam as f32 * 0.03);

    calc(imgx as u32, imgy as u32, offsetx, offsety, zoom, c_param)
}


fn calc(imgx: u32, imgy: u32, offsetx: f32, offsety: f32, zoom: f32, c: Complex<f32>) -> image::ImageBuffer<image::Rgba<u8>, Vec<u8>> {
    let max_iterations = 255u16 / 2;
    let scalex = zoom / imgx as f32;
    let scaley = zoom / imgy as f32;

    image::ImageBuffer::from_fn(imgx, imgy, |x, y| {
        let cy = (y as f32 + offsety) * scaley - (zoom / 2.0);
        let cx = (x as f32 + offsetx) * scalex - (zoom / 2.0);

        let mut z = Complex::new(cx, cy);

        let mut i = 0;

        for t in 0..max_iterations {
            if z.norm() > 2.0 {
                break
            }
            z = z * z + c;
            i = t;
        }
        let lum = i as f32;

        image::Rgba([hue_to_rgb(lum/255.0 - 0.3) as u8,
                    hue_to_rgb(lum/255.0) as u8,
                    hue_to_rgb(lum/255.0 + 0.3) as u8,
                    255])
    })
}

#[no_mangle]
pub fn fractal_generate(imgx: i32, imgy: i32, cparam: i32) -> *const u8 {

    let imgbuf = fractal(imgx, imgy, cparam);

    vec2js(imgbuf.into_raw())
}

#[no_mangle]
pub fn fractal_get_image(imgx: i32, imgy: i32, cparam: i32) -> *const u8 {

    let imgbuf = fractal(imgx, imgy, cparam);
    let ref mut vec: Vec<u8> = Vec::new();
    image::ImageRgba8(imgbuf).save(vec, image::PNG).unwrap();

    vec2js(vec.as_mut())
}