const Fragrance = require('../models/Fragrance');

/**
 * Data Access Object for Inventory operations
 * Handles the Smart Decant Inventory System logic
 */
class InventoryDAO {

    /**
     * Check if decant is available for the requested amount
     * @param {String} fragranceId - The fragrance ID
     * @param {Number} mlNeeded - Milliliters requested
     */
    async checkDecantAvailability(fragranceId, mlNeeded) {
        const fragrance = await Fragrance.findById(fragranceId);
        if (!fragrance) {
            throw new Error('Fragrance not found');
        }

        const { openDecantMl, sealedBottles, bottleSize } = fragrance.inventory;

        // Total available = current decant + (sealed bottles * bottle size)
        const totalAvailableMl = openDecantMl + (sealedBottles * bottleSize);

        return {
            available: totalAvailableMl >= mlNeeded,
            currentDecantMl: openDecantMl,
            sealedBottles,
            bottleSize,
            totalAvailableMl,
            requestedMl: mlNeeded
        };
    }

    /**
     * Smart Decant Conversion: Open a sealed bottle to create decant inventory
     * This is the core business logic of the dual-inventory system
     * @param {String} fragranceId - The fragrance ID
     */
    async convertBottleToDecant(fragranceId) {
        const fragrance = await Fragrance.findById(fragranceId);
        if (!fragrance) {
            throw new Error('Fragrance not found');
        }

        if (fragrance.inventory.sealedBottles <= 0) {
            throw new Error('No sealed bottles available for conversion');
        }

        const { bottleSize } = fragrance.inventory;

        // Perform the conversion: -1 sealed bottle, +bottleSize ml to decant
        fragrance.inventory.sealedBottles -= 1;
        fragrance.inventory.openDecantMl += bottleSize;

        await fragrance.save();

        return {
            success: true,
            fragranceId,
            bottleConverted: true,
            newSealedBottles: fragrance.inventory.sealedBottles,
            newOpenDecantMl: fragrance.inventory.openDecantMl,
            message: `Converted 1 sealed bottle (${bottleSize}ml) to decant inventory`
        };
    }

    /**
     * Deduct inventory based on order type
     * Handles both bottle and decant orders with auto-conversion
     * @param {String} fragranceId - The fragrance ID
     * @param {String} type - 'bottle' or 'decant'
     * @param {Number} quantity - For bottles: number of bottles, For decants: ml amount
     */
    async deductInventory(fragranceId, type, quantity) {
        const fragrance = await Fragrance.findById(fragranceId);
        if (!fragrance) {
            throw new Error('Fragrance not found');
        }

        if (type === 'bottle') {
            // Deduct sealed bottles
            if (fragrance.inventory.sealedBottles < quantity) {
                throw new Error(`Insufficient bottle stock. Available: ${fragrance.inventory.sealedBottles}`);
            }

            fragrance.inventory.sealedBottles -= quantity;
            await fragrance.save();

            return {
                success: true,
                type: 'bottle',
                deducted: quantity,
                remainingSealedBottles: fragrance.inventory.sealedBottles
            };

        } else if (type === 'decant') {
            // Smart Decant Logic: Auto-convert if needed
            const mlNeeded = quantity;

            // Check if we need to convert a bottle
            while (fragrance.inventory.openDecantMl < mlNeeded && fragrance.inventory.sealedBottles > 0) {
                // Auto-conversion trigger!
                fragrance.inventory.sealedBottles -= 1;
                fragrance.inventory.openDecantMl += fragrance.inventory.bottleSize;
                console.log(`[Inventory] Auto-converted 1 bottle to ${fragrance.inventory.bottleSize}ml decant`);
            }

            // Check if we have enough after conversion attempts
            if (fragrance.inventory.openDecantMl < mlNeeded) {
                throw new Error(`Insufficient decant stock. Available: ${fragrance.inventory.openDecantMl}ml`);
            }

            // Deduct the decant
            fragrance.inventory.openDecantMl -= mlNeeded;
            await fragrance.save();

            return {
                success: true,
                type: 'decant',
                deducted: mlNeeded,
                remainingDecantMl: fragrance.inventory.openDecantMl,
                remainingSealedBottles: fragrance.inventory.sealedBottles
            };
        }

        throw new Error('Invalid inventory type. Must be "bottle" or "decant"');
    }

    /**
     * Add inventory (for restocking)
     */
    async addInventory(fragranceId, type, quantity) {
        const fragrance = await Fragrance.findById(fragranceId);
        if (!fragrance) {
            throw new Error('Fragrance not found');
        }

        if (type === 'bottle') {
            fragrance.inventory.sealedBottles += quantity;
        } else if (type === 'decant') {
            fragrance.inventory.openDecantMl += quantity;
        } else {
            throw new Error('Invalid inventory type');
        }

        await fragrance.save();

        return {
            success: true,
            type,
            added: quantity,
            currentInventory: fragrance.inventory
        };
    }

    /**
     * Get inventory status for a fragrance
     */
    async getInventoryStatus(fragranceId) {
        const fragrance = await Fragrance.findById(fragranceId);
        if (!fragrance) {
            throw new Error('Fragrance not found');
        }

        const { sealedBottles, bottleSize, openDecantMl } = fragrance.inventory;

        return {
            fragranceId,
            fragranceName: fragrance.name,
            sealedBottles,
            bottleSize,
            openDecantMl,
            totalAvailableMl: openDecantMl + (sealedBottles * bottleSize),
            canSellBottle: sealedBottles > 0,
            canSellDecant: openDecantMl > 0 || sealedBottles > 0
        };
    }
}

module.exports = new InventoryDAO();
