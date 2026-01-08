"""
Batch Payout Endpoint for PaySwiftly

Trigger batch payouts for all drivers above minimum threshold.
Call this endpoint weekly or manually to process accumulated driver earnings.
"""

from fastapi import HTTPException
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


async def trigger_batch_payout(intasend_api, supabase_manager):
    """
    Trigger batch payout for all drivers above minimum threshold.
    
    Args:
        intasend_api: IntaSend API instance
        supabase_manager: Supabase manager instance
        
    Returns:
        dict: Summary of payouts processed
    """
    try:
        # Get minimum threshold from IntaSend API config
        minimum_threshold = intasend_api.minimum_payout
        
        #Get all eligible drivers
        drivers = await supabase_manager.get_drivers_for_payout(minimum_threshold)
        
        if not drivers:
            return {
                "status": "success",
                "message": "No drivers eligible for payout",
                "processed": 0,
                "total_amount": 0
            }
        
        results = []
        total_amount = 0
        success_count = 0
        
        for driver in drivers:
            try:
                logger.info(f"Processing batch payout for driver {driver['id']}: KES {driver['pending_balance']}")
                
                # Initiate payout via IntaSend
                payout_response = await intasend_api.initiate_batch_payout(
                    phone_number=driver['phone'],
                    amount=driver['pending_balance'],
                    reference=f"batch_{driver['id']}_{datetime.now().strftime('%Y%m%d')}",
                    name=driver['name']
                )
                
                tracking_id = payout_response.get('tracking_id')
                
                if tracking_id:
                    # Update driver balances (move pending to paid)
                    await supabase_manager.process_batch_payout_completion(
                        driver_id=driver['id'],
                        amount=driver['pending_balance'],
                        tracking_id=tracking_id
                    )
                    
                    results.append({
                        "driver_id": driver['id'],
                        "driver_name": driver['name'],
                        "amount": driver['pending_balance'],
                        "tracking_id": tracking_id,
                        "status": "success"
                    })
                    
                    total_amount += driver['pending_balance']
                    success_count += 1
                    logger.info(f"Batch payout successful for driver {driver['id']}")
                else:
                    raise Exception("No tracking ID in payout response")
                    
            except Exception as e:
                logger.error(f"Batch payout failed for driver {driver['id']}: {str(e)}")
                results.append({
                    "driver_id": driver['id'],
                    "driver_name": driver.get('name', 'Unknown'),
                    "amount": driver['pending_balance'],
                    "status": "failed",
                    "error": str(e)
                })
        
        return {
            "status": "success",
            "message": f"Processed {success_count} of {len(drivers)} payouts",
            "processed": success_count,
            "total_amount": round(total_amount, 2),
            "details": results
        }
        
    except Exception as e:
        logger.error(f"Batch payout trigger failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
