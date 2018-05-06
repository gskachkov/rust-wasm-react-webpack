#[no_mangle]
pub fn command() -> i32 {
    32
}

// Basic
// "memory_size", "a20_enabled", "mem_page_infos", "mem8", "mem16", "mem32s", "segment_is_null", "segment_limits", "segment_offsets", "tlb_data", "tlb_info", "tlb_info_global", "protected_mode", "idtr_size", "idtr_offset", "gdtr_size", "gdtr_offset", "tss_size_32", "page_fault", "cr", "cpl", "page_size_extensions", "is_32", "stack_size_32", "in_hlt", "last_virt_eip", "eip_phys", "last_virt_esp", "esp_phys", "sysenter_cs", "sysenter_esp", "sysenter_eip", "prefixes", "flags", "flags_changed", "last_op1", "last_op2", "last_op_size", "last_add_result", "last_result", "mul32_result", "div32_result", "tsc_offset", "modrm_byte", "phys_addr", "phys_addr_high", "devices", "table", "paging", "instruction_pointer", "previous_ip", "apic_enabled", "timestamp_counter", "reg32s", "reg32", "reg16s", "reg16", "reg8s", "reg8", "reg_mmxs", "reg_mmx", "reg_mmx8s", "reg_mmx8", "reg_xmm32s", "mxcsr", "sreg", "dreg", "memory_map_read8", "memory_map_write8", "memory_map_read32", "memory_map_write32", "bios", "fw_value", "io", "fpu", "bus"
// Misc 
// "jmpcc16", "jmpcc32", "jmp16", "loop", "loope", "loopne", "jcxz", "test_cc", "mov", "push", "pop", "pusha", "popa", "xchg", "lss", "lea", "enter", "bswap", "fxsave", "fxrstor"