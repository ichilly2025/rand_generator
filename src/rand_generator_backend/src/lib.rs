use candid::CandidType;
use ic_cdk::api::management_canister::main::raw_rand;
use ic_cdk::api::{instruction_counter, performance_counter};
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha20Rng;
use serde::{Deserialize, Serialize};

// Custom getrandom implementation for WASM compatibility
// This won't be called since we use IC's raw_rand directly
use getrandom::{register_custom_getrandom, Error};

fn custom_getrandom(_buf: &mut [u8]) -> Result<(), Error> {
    // This should never be called in our implementation
    Err(Error::UNSUPPORTED)
}

register_custom_getrandom!(custom_getrandom);

#[derive(CandidType, Serialize, Deserialize)]
pub struct RandomNumbersResult {
    pub seed: Vec<u8>,
    pub numbers: Vec<u32>,
    pub count: u64,
    pub range_max: u32,
    pub generation_time_ns: u64,
    pub cycles_used: u64,
}

#[ic_cdk::update]
async fn generate_random_numbers() -> Result<RandomNumbersResult, String> {
    let start_time = performance_counter(0);
    let start_instructions = instruction_counter();

    // Get random seed from IC
    let seed_result = raw_rand().await;
    let seed = match seed_result {
        Ok((seed_bytes,)) => seed_bytes,
        Err(e) => return Err(format!("Failed to get random seed: {:?}", e)),
    };

    // Create RNG from the IC-provided seed
    let mut rng = ChaCha20Rng::from_seed(
        seed[0..32]
            .try_into()
            .map_err(|_| "Invalid seed length".to_string())?,
    );

    // Generate 3000 random numbers within range of 50000
    let mut numbers = Vec::with_capacity(3000);
    for _ in 0..3000 {
        numbers.push(rng.gen_range(0..50000));
    }

    let end_time = performance_counter(0);
    let end_instructions = instruction_counter();
    
    let generation_time_ns = end_time - start_time;
    let cycles_used = end_instructions - start_instructions;

    Ok(RandomNumbersResult {
        seed: seed.to_vec(),
        numbers,
        count: 3000u64,
        range_max: 50000u32,
        generation_time_ns,
        cycles_used,
    })
}


