/* 
extern crate px86;

use std::env;

const MEMORY_SIZE: usize = 1024 * 1024;

fn main() {
    if let Some(path) = env::args().nth(1) {
        px86::emulate(MEMORY_SIZE, &path);
    } else {
        println!("usage: cargo run path/to/binary");
    }
}
*/


use std::mem;

mod emulator;
mod instructions;
mod modrm;

#[no_mangle]
pub extern fn alloc_bin_data(size: u32) -> *mut u8 {
    let cap = size as usize;
    let mut buf: Vec<u8> = Vec::with_capacity(cap);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    return ptr;
}

#[no_mangle]
pub fn emulate(bin_ptr: *mut u8, bin_length: u32) {
    let cap = bin_length as usize;
    let mut buf: Vec<u8> = unsafe {
        Vec::from_raw_parts(bin_ptr, cap, cap)
    };

    let mut emu = emulator::Emulator::new(buf.to_vec(), cap, 0x7c00, 0x7c00);
    // emu.load(path);
    emu.run();
    emu.dump_registers();
    mem::forget(buf);
}